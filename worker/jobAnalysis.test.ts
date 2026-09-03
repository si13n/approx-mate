import { describe, expect, it, vi } from "vitest"
import { getJobAnalysisResponse, validateJobUrl } from "./jobAnalysis"

const requestFor = (url: unknown) =>
  new Request("https://approxmate.me/api/job-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })

describe("job analysis Worker endpoint", () => {
  it.each([
    "http://localhost/job",
    "http://127.0.0.1/job",
    "http://10.0.0.2/job",
    "http://169.254.169.254/latest/meta-data",
    "https://user:secret@example.com/job",
    "file:///etc/passwd",
  ])("blocks unsafe URL %s", (url) => {
    expect(() => validateJobUrl(url)).toThrow()
  })

  it("normalizes a safe public URL", () => {
    expect(validateJobUrl("https://jobs.example.com/qa#apply").toString()).toBe(
      "https://jobs.example.com/qa",
    )
  })

  it("returns a deterministic analysis for public HTML", async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response("<html><body>job</body></html>", {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    )
    const extractor = vi.fn(async () => ({
      text: `
        Senior QA Engineer
        Company: Acme
        Location: Kraków, Poland
        Contract: B2B
        Salary: 25k PLN gross / month
        Required skills
        - TypeScript
        - Playwright
      `,
      jsonLd: [],
      metadata: {},
    }))

    const response = await getJobAnalysisResponse(
      requestFor("https://jobs.example.com/qa"),
      fetchFn,
      extractor,
    )
    const result = (await response.json()) as {
      title: { value: string }
      salary: { value: { min: number } }
    }

    expect(response.status).toBe(200)
    expect(result.title.value).toBe("Senior QA Engineer")
    expect(result.salary.value.min).toBe(25000)
    expect(fetchFn).toHaveBeenCalledWith(
      new URL("https://jobs.example.com/qa"),
      expect.objectContaining({ redirect: "manual" }),
    )
  })

  it("revalidates redirect targets", async () => {
    const response = await getJobAnalysisResponse(
      requestFor("https://jobs.example.com/qa"),
      vi.fn(
        async () =>
          new Response(null, {
            status: 302,
            headers: { Location: "http://127.0.0.1/private" },
          }),
      ),
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({
      error: { code: "FETCH_BLOCKED" },
    })
  })

  it("rejects non-HTML responses", async () => {
    const response = await getJobAnalysisResponse(
      requestFor("https://jobs.example.com/file.pdf"),
      vi.fn(
        async () =>
          new Response("pdf", {
            headers: { "Content-Type": "application/pdf" },
          }),
      ),
    )

    expect(response.status).toBe(415)
    expect(await response.json()).toMatchObject({
      error: { code: "UNSUPPORTED_CONTENT" },
    })
  })

  it("stops reading HTML that exceeds the response limit", async () => {
    const extractor = vi.fn()
    const response = await getJobAnalysisResponse(
      requestFor("https://jobs.example.com/huge"),
      vi.fn(
        async () =>
          new Response("x".repeat(1_500_001), {
            headers: { "Content-Type": "text/html" },
          }),
      ),
      extractor,
    )

    expect(response.status).toBe(413)
    expect(await response.json()).toMatchObject({
      error: { code: "CONTENT_TOO_LARGE" },
    })
    expect(extractor).not.toHaveBeenCalled()
  })

  it("maps malformed request bodies to a stable error", async () => {
    const request = new Request("https://approxmate.me/api/job-analysis", {
      method: "POST",
      body: "{",
    })
    const response = await getJobAnalysisResponse(request)
    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({
      error: { code: "INVALID_INPUT" },
    })
  })
})
