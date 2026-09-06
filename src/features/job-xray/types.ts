export type SourceKind = "url" | "text"
export type Confidence = "high" | "medium" | "low"
export type ExtractionMethod = "json-ld" | "meta" | "section" | "pattern" | "derived"

export interface ExtractedField<T> {
  value: T | null
  confidence: Confidence | null
  method: ExtractionMethod | null
  evidence: string[]
}

export interface SalaryRange {
  min: number | null
  max: number | null
  currency: "PLN" | "USD" | "EUR" | null
  period: "hour" | "day" | "month" | "year" | null
  amountType: "gross" | "net" | "invoice" | "unknown"
}

export interface JobAnalysis {
  id: string
  source: {
    kind: SourceKind
    url: string | null
    capturedAt: string
  }
  title: ExtractedField<string>
  company: ExtractedField<string>
  location: ExtractedField<string>
  workMode: ExtractedField<"remote" | "hybrid" | "onsite">
  officeDaysPerWeek: ExtractedField<number>
  contractTypes: ExtractedField<string[]>
  salary: ExtractedField<SalaryRange>
  seniority: ExtractedField<string>
  experience: ExtractedField<string>
  english: ExtractedField<string>
  requiredSkills: ExtractedField<string[]>
  responsibilities: ExtractedField<string[]>
  niceToHave: ExtractedField<string[]>
  benefits: ExtractedField<string[]>
  warnings: string[]
}

export interface AnalyzedOffer {
  id: string
  analysis: JobAnalysis
  sourceText: string | null
}

export interface JobDocumentMetadata {
  title?: string | null
  description?: string | null
  heading?: string | null
}

export interface ParseJobInput {
  text: string
  sourceKind: SourceKind
  url?: string | null
  capturedAt?: string
  jsonLd?: unknown[]
  metadata?: JobDocumentMetadata
}

export type JobAnalysisErrorCode = "INVALID_INPUT" | "FETCH_BLOCKED" | "UNSUPPORTED_CONTENT" | "CONTENT_TOO_LARGE" | "NO_JOB_CONTENT" | "PARSE_FAILED"

export interface JobAnalysisErrorResponse {
  error: {
    code: JobAnalysisErrorCode
    message: string
  }
}
