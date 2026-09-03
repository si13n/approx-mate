import { parseJobPosting } from "../src/features/job-xray/parser"
import type {
  JobAnalysisErrorCode,
  JobDocumentMetadata,
} from "../src/features/job-xray/types"

const MAX_URL_LENGTH = 2_048
const MAX_DOCUMENT_BYTES = 1_500_000
const MAX_EXTRACTED_TEXT = 100_000
const MAX_REDIRECTS = 3
const FETCH_TIMEOUT_MS = 8_000

type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

interface PublicPageResponse {
  response: Response
  finalUrl: URL
}

export interface ExtractedJobDocument {
  text: string
  jsonLd: unknown[]
  metadata: JobDocumentMetadata
}

type HtmlExtractor = (html: string) => Promise<ExtractedJobDocument>

class JobAnalysisRequestError extends Error {
  constructor(
    readonly code: JobAnalysisErrorCode,
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}

function isPrivateIpv4(hostname: string): boolean {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) return false
  const octets = hostname.split(".").map(Number)
  if (octets.some((octet) => octet < 0 || octet > 255)) return true
  const [first, second] = octets
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    first >= 224
  )
}

export function validateJobUrl(rawUrl: string): URL {
  if (!rawUrl || rawUrl.length > MAX_URL_LENGTH) {
    throw new JobAnalysisRequestError("INVALID_INPUT", "Invalid URL", 400)
  }
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new JobAnalysisRequestError("INVALID_INPUT", "Invalid URL", 400)
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new JobAnalysisRequestError(
      "INVALID_INPUT",
      "Only public HTTP(S) URLs are supported",
      400,
    )
  }
  const hostname = url.hostname.toLocaleLowerCase().replace(/^\[|\]$/g, "")
  const unsafeName =
    hostname === "localhost" ||
    hostname === "metadata.google.internal" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan") ||
    hostname.endsWith(".home")
  const ipv6Literal = hostname.includes(":")
  if (unsafeName || ipv6Literal || isPrivateIpv4(hostname)) {
    throw new JobAnalysisRequestError(
      "FETCH_BLOCKED",
      "This URL cannot be fetched",
      400,
    )
  }
  url.hash = ""
  return url
}

async function fetchPublicPage(
  initialUrl: URL,
  fetchFn: FetchFunction,
): Promise<PublicPageResponse> {
  let currentUrl = initialUrl
  for (
    let redirectCount = 0;
    redirectCount <= MAX_REDIRECTS;
    redirectCount += 1
  ) {
    let response: Response
    try {
      response = await fetchFn(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          Accept: "text/html,application/xhtml+xml;q=0.9",
          "User-Agent": "ApproxMate-Job-X-Ray/1.0 (+https://approxmate.me)",
        },
      })
    } catch {
      throw new JobAnalysisRequestError(
        "FETCH_BLOCKED",
        "The vacancy page could not be reached",
        422,
      )
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location")
      if (!location || redirectCount === MAX_REDIRECTS) {
        throw new JobAnalysisRequestError(
          "FETCH_BLOCKED",
          "Too many or invalid redirects",
          422,
        )
      }
      currentUrl = validateJobUrl(new URL(location, currentUrl).toString())
      continue
    }
    if (!response.ok) {
      throw new JobAnalysisRequestError(
        "FETCH_BLOCKED",
        `The vacancy page returned HTTP ${response.status}`,
        422,
      )
    }
    return { response, finalUrl: currentUrl }
  }
  throw new JobAnalysisRequestError("FETCH_BLOCKED", "Too many redirects", 422)
}

async function readHtmlWithLimit(response: Response): Promise<string> {
  if (!response.body) return ""
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    totalBytes += value.byteLength
    if (totalBytes > MAX_DOCUMENT_BYTES) {
      await reader.cancel()
      throw new JobAnalysisRequestError(
        "CONTENT_TOO_LARGE",
        "The vacancy page is too large",
        413,
      )
    }
    chunks.push(value)
  }

  const bytes = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

export async function extractJobDocument(
  html: string,
): Promise<ExtractedJobDocument> {
  const textParts: string[] = []
  const jsonLdStrings: string[] = []
  const metadata: JobDocumentMetadata = {}
  let jsonLdBuffer = ""
  let titleBuffer = ""
  let headingBuffer = ""

  const rewriter = new HTMLRewriter()
    .on("script", {
      element(element: any) {
        if (element.getAttribute("type") !== "application/ld+json")
          element.remove()
      },
    })
    .on("style", {
      element(element: any) {
        element.remove()
      },
    })
    .on("noscript", {
      element(element: any) {
        element.remove()
      },
    })
    .on("svg", {
      element(element: any) {
        element.remove()
      },
    })
    .on('script[type="application/ld+json"]', {
      element(element: any) {
        jsonLdBuffer = ""
        element.onEndTag(() => {
          if (jsonLdBuffer.trim()) jsonLdStrings.push(jsonLdBuffer)
          jsonLdBuffer = ""
        })
      },
      text(text: any) {
        jsonLdBuffer += text.text
      },
    })
    .on("title", {
      text(text: any) {
        titleBuffer += text.text
        if (text.lastInTextNode && titleBuffer.trim())
          metadata.title = titleBuffer.trim()
      },
    })
    .on("h1", {
      element(element: any) {
        headingBuffer = ""
        element.onEndTag(() => {
          if (headingBuffer.trim() && !metadata.heading)
            metadata.heading = headingBuffer.trim()
          textParts.push("\n")
          headingBuffer = ""
        })
      },
      text(text: any) {
        headingBuffer += text.text
      },
    })
    .on("meta", {
      element(element: any) {
        const key = (
          element.getAttribute("property") ??
          element.getAttribute("name") ??
          ""
        ).toLocaleLowerCase()
        const content = element.getAttribute("content")?.trim()
        if (!content) return
        if ((key === "og:title" || key === "twitter:title") && !metadata.title)
          metadata.title = content
        if (
          (key === "description" || key === "og:description") &&
          !metadata.description
        )
          metadata.description = content
      },
    })
    .on("body", {
      text(text: any) {
        if (textParts.join("").length < MAX_EXTRACTED_TEXT)
          textParts.push(text.text)
      },
    })
    .on("p,li,h2,h3,h4", {
      element(element: any) {
        element.onEndTag(() => textParts.push("\n"))
      },
    })
    .on("br", {
      element() {
        textParts.push("\n")
      },
    })

  await rewriter.transform(new Response(html)).arrayBuffer()

  const jsonLd = jsonLdStrings.flatMap((value) => {
    try {
      return [JSON.parse(value) as unknown]
    } catch {
      return []
    }
  })

  return {
    text: textParts.join("").slice(0, MAX_EXTRACTED_TEXT),
    jsonLd,
    metadata,
  }
}

export async function getJobAnalysisResponse(
  request: Request,
  fetchFn: FetchFunction = fetch,
  extractor: HtmlExtractor = extractJobDocument,
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse(
      { error: { code: "INVALID_INPUT", message: "Method not allowed" } },
      405,
    )
  }

  try {
    const body = (await request.json()) as { url?: unknown }
    if (typeof body.url !== "string") {
      throw new JobAnalysisRequestError(
        "INVALID_INPUT",
        "A vacancy URL is required",
        400,
      )
    }
    const initialUrl = validateJobUrl(body.url.trim())
    const { response, finalUrl } = await fetchPublicPage(initialUrl, fetchFn)
    const contentType =
      response.headers.get("Content-Type")?.toLocaleLowerCase() ?? ""
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new JobAnalysisRequestError(
        "UNSUPPORTED_CONTENT",
        "The URL does not return an HTML page",
        415,
      )
    }
    const declaredLength = Number(response.headers.get("Content-Length") ?? 0)
    if (declaredLength > MAX_DOCUMENT_BYTES) {
      throw new JobAnalysisRequestError(
        "CONTENT_TOO_LARGE",
        "The vacancy page is too large",
        413,
      )
    }
    const document = await extractor(await readHtmlWithLimit(response))
    if (document.text.trim().length < 30 && document.jsonLd.length === 0) {
      throw new JobAnalysisRequestError(
        "NO_JOB_CONTENT",
        "No readable vacancy content was found",
        422,
      )
    }
    const analysis = parseJobPosting({
      ...document,
      sourceKind: "url",
      url: finalUrl.toString(),
    })
    return jsonResponse(analysis)
  } catch (error) {
    if (error instanceof JobAnalysisRequestError) {
      return jsonResponse(
        { error: { code: error.code, message: error.message } },
        error.status,
      )
    }
    if (error instanceof SyntaxError) {
      return jsonResponse(
        { error: { code: "INVALID_INPUT", message: "Invalid request body" } },
        400,
      )
    }
    return jsonResponse(
      {
        error: {
          code: "PARSE_FAILED",
          message: "The vacancy could not be analyzed",
        },
      },
      422,
    )
  }
}
