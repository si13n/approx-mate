import { parseJobPosting } from "./parser"
import type {
  JobAnalysis,
  JobAnalysisErrorCode,
  JobAnalysisErrorResponse,
} from "./types"

export class JobAnalysisClientError extends Error {
  constructor(
    readonly code: JobAnalysisErrorCode,
    message: string,
  ) {
    super(message)
  }
}

export function isVacancyUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.toString().length > 0
    )
  } catch {
    return false
  }
}

export async function analyzeJobInput(value: string): Promise<JobAnalysis> {
  const input = value.trim()
  if (!input)
    throw new JobAnalysisClientError(
      "INVALID_INPUT",
      "Enter a vacancy URL or text",
    )

  if (!isVacancyUrl(input)) {
    if (input.length < 30) {
      throw new JobAnalysisClientError(
        "INVALID_INPUT",
        "Paste more of the vacancy so it can be analyzed",
      )
    }
    try {
      return parseJobPosting({ text: input, sourceKind: "text" })
    } catch {
      throw new JobAnalysisClientError(
        "PARSE_FAILED",
        "The vacancy text could not be analyzed",
      )
    }
  }

  let response: Response
  try {
    response = await fetch("/api/job-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: input }),
    })
  } catch {
    throw new JobAnalysisClientError(
      "FETCH_BLOCKED",
      "The vacancy page could not be reached",
    )
  }

  const payload = (await response
    .json()
    .catch(() => null)) as JobAnalysis | JobAnalysisErrorResponse | null
  if (!response.ok || !payload || "error" in payload) {
    const error = payload && "error" in payload ? payload.error : null
    throw new JobAnalysisClientError(
      error?.code ?? "PARSE_FAILED",
      error?.message ?? "The vacancy could not be analyzed",
    )
  }
  return payload
}
