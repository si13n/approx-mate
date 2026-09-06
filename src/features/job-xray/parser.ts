import {
  sectionAliases,
  skillDictionary,
  type JobSection,
} from "./dictionaries"
import type {
  ExtractedField,
  ExtractionMethod,
  JobAnalysis,
  ParseJobInput,
  SalaryRange,
} from "./types"

const MAX_TEXT_LENGTH = 100_000
const genericHeadings = new Set(
  Object.values(sectionAliases)
    .flat()
    .map((heading) => normalizeHeading(heading)),
)

function emptyField<T>(): ExtractedField<T> {
  return { value: null, confidence: null, method: null, evidence: [] }
}

function field<T>(
  value: T | null | undefined,
  confidence: ExtractedField<T>["confidence"],
  method: ExtractionMethod,
  evidence: Array<string | null | undefined> = [],
): ExtractedField<T> {
  if (value === null || value === undefined) return emptyField<T>()
  return {
    value,
    confidence,
    method,
    evidence: evidence
      .filter((item): item is string => Boolean(item))
      .slice(0, 4),
  }
}

function stripMarkup(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>|<\/li>|<\/div>|<\/h[1-6]>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
}

export function normalizeJobText(value: string): string {
  return stripMarkup(value)
    .normalize("NFKC")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/[\u00a0\u2007\u202f]/g, " ")
    .replace(/[•●▪◦]/g, "•")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, MAX_TEXT_LENGTH)
}

function normalizeHeading(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/^[\s#>*•\-–—]+/, "")
    .replace(/[:：.]+$/, "")
    .replace(/\s+/g, " ")
    .trim()
}

function cleanListItem(value: string): string {
  return value
    .replace(/^[\s>*•\-–—\d.)]+/, "")
    .replace(/\s+/g, " ")
    .trim()
}

function unique(values: string[], limit = 12): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    const cleaned = value.trim()
    const key = cleaned.toLocaleLowerCase()
    if (!cleaned || seen.has(key)) continue
    seen.add(key)
    result.push(cleaned)
    if (result.length >= limit) break
  }
  return result
}

function identifySection(line: string): JobSection | null {
  const normalized = normalizeHeading(line)
  for (const [section, aliases] of Object.entries(
    sectionAliases,
  ) as Array<[JobSection, string[]]>) {
    if (aliases.some((alias) => normalized === normalizeHeading(alias)))
      return section
  }
  return null
}

function extractSections(text: string): Partial<Record<JobSection, string[]>> {
  const result: Partial<Record<JobSection, string[]>> = {}
  let current: JobSection | null = null
  for (const line of text.split("\n")) {
    const nextSection = identifySection(line)
    if (nextSection) {
      current = nextSection
      result[current] ??= []
      continue
    }
    if (!current) continue
    const cleaned = cleanListItem(line)
    if (cleaned.length < 2 || cleaned.length > 260) continue
    result[current]!.push(cleaned)
  }
  for (const key of Object.keys(result) as JobSection[])
    result[key] = unique(result[key]!, 10)
  return result
}

function containsAlias(text: string, alias: string): boolean {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`(^|[^a-z0-9+#.])${escaped}($|[^a-z0-9+#.])`, "i").test(
    text,
  )
}

function extractSkills(text: string): string[] {
  return skillDictionary
    .filter((skill) =>
      skill.aliases.some((alias) => containsAlias(text, alias)),
    )
    .map((skill) => skill.label)
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim()
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return null
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) return unique(value.flatMap(asStringList))
  const stringValue = asString(value)
  if (!stringValue) return []
  return unique(
    stringValue
      .split(/[,;|]/)
      .map((item) => item.trim())
      .filter(Boolean),
  )
}

function collectJobPostings(values: unknown[]): Record<string, unknown>[] {
  const result: Record<string, unknown>[] = []
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit)
      return
    }
    const record = asRecord(value)
    if (!record) return
    const type = record["@type"]
    if (
      type === "JobPosting" ||
      (Array.isArray(type) && type.includes("JobPosting"))
    ) {
      result.push(record)
    }
    if (record["@graph"]) visit(record["@graph"])
  }
  values.forEach(visit)
  return result
}

function getStructuredName(value: unknown): string | null {
  const record = asRecord(value)
  return asString(record?.name) ?? asString(value)
}

function getStructuredLocation(value: unknown): string | null {
  const locations = Array.isArray(value) ? value : [value]
  const labels = locations.flatMap((location) => {
    const record = asRecord(location)
    const address = asRecord(record?.address)
    if (!address) return []
    return [
      [
        asString(address.addressLocality),
        asString(address.addressRegion),
        asString(address.addressCountry),
      ]
        .filter(Boolean)
        .join(", "),
    ].filter(Boolean)
  })
  return unique(labels, 3).join(" · ") || null
}

function parseNumericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const parsed = Number.parseFloat(
    String(value).replace(/\s/g, "").replace(",", "."),
  )
  return Number.isFinite(parsed) ? parsed : null
}

function parseStructuredSalary(value: unknown): SalaryRange | null {
  const salary = asRecord(value)
  if (!salary) return null
  const rawValue = asRecord(salary.value) ?? salary
  const exact = parseNumericValue(rawValue.value)
  const min = parseNumericValue(rawValue.minValue) ?? exact
  const max = parseNumericValue(rawValue.maxValue) ?? exact ?? min
  if (min === null && max === null) return null
  const currencyRaw = (
    asString(salary.currency) ?? asString(rawValue.currency)
  )?.toUpperCase()
  const currency =
    currencyRaw === "PLN" || currencyRaw === "USD" || currencyRaw === "EUR"
      ? currencyRaw
      : null
  const unit = (asString(rawValue.unitText) ?? "").toLocaleLowerCase()
  const period =
    unit.includes("hour") || unit === "h"
      ? "hour"
      : unit.includes("day")
        ? "day"
        : unit.includes("year")
          ? "year"
          : unit.includes("month")
            ? "month"
            : null
  return { min, max, currency, period, amountType: "unknown" }
}

function firstMatchingLine(text: string, pattern: RegExp): string | null {
  return text.split("\n").find((line) => pattern.test(line)) ?? null
}

function extractLabelledValue(text: string, labels: string[]): string | null {
  const labelPattern = labels
    .map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")
  const match = text.match(
    new RegExp(`^(?:${labelPattern})\\s*[:|-]\\s*(.+)$`, "im"),
  )
  return match?.[1]?.trim() ?? null
}

function parseCompactNumber(raw: string, useThousands: boolean): number | null {
  const compact = raw.replace(/\s/g, "")
  let normalized = compact
  if (/^\d{1,3}([,.]\d{3})+$/.test(compact))
    normalized = compact.replace(/[,.]/g, "")
  else normalized = compact.replace(",", ".")
  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed)) return null
  return useThousands ? parsed * 1000 : parsed
}

interface SalaryCandidate {
  salary: SalaryRange
  evidence: string
  score: number
}

function parseSalary(text: string): ExtractedField<SalaryRange> {
  const candidates: SalaryCandidate[] = []
  const pattern =
    /(?:(PLN|USD|EUR|zł|zl|\$|€)\s*)?(\d{1,3}(?:[\s,.]\d{3})+|\d+(?:[.,]\d+)?)(?!\d)\s*(k|tys\.?|tyś\.?)?(?:\s*(?:-|to|do)\s*(?:(PLN|USD|EUR|zł|zl|\$|€)\s*)?(\d{1,3}(?:[\s,.]\d{3})+|\d+(?:[.,]\d+)?)(?!\d)\s*(k|tys\.?|tyś\.?)?)?\s*(PLN|USD|EUR|zł|zl|\$|€)?/gi

  for (const line of text.split("\n")) {
    pattern.lastIndex = 0
    for (const match of line.matchAll(pattern)) {
      const prefix = match[1]
      const minRaw = match[2]
      const minSuffix = match[3]
      const rangePrefix = match[4]
      const maxRaw = match[5]
      const maxSuffix = match[6]
      const currencyToken = match[7] ?? prefix ?? rangePrefix
      const thousands = Boolean(minSuffix || maxSuffix)
      const min = parseCompactNumber(minRaw, thousands)
      const max = maxRaw ? parseCompactNumber(maxRaw, thousands) : min
      if (min === null || max === null) continue
      const currencyValue = currencyToken?.toUpperCase()
      const currency =
        currencyValue === "$" || currencyValue === "USD"
          ? "USD"
          : currencyValue === "€" || currencyValue === "EUR"
            ? "EUR"
            : currencyValue === "PLN" ||
                currencyValue === "ZŁ" ||
                currencyValue === "ZL"
              ? "PLN"
              : null
      const lower = line.toLocaleLowerCase()
      const period = /(?:\/\s*|per\s+|za\s+)(?:h|hour|godz)|hourly|godzin/.test(
        lower,
      )
        ? "hour"
        : /(?:\/|per\s+|za\s+)day|daily|dzienn/.test(lower)
          ? "day"
          : /annual|year|rocznie|rok/.test(lower)
            ? "year"
            : /month|monthly|mies|\/mo\b/.test(lower)
              ? "month"
              : null
      const amountType = /invoice|faktur/.test(lower)
        ? "invoice"
        : /gross|brutto/.test(lower)
          ? "gross"
          : /\bnet\b|netto|take-home|na rękę/.test(lower)
            ? "net"
            : "unknown"
      let score = currency ? 4 : 0
      if (
        /salary|wynagrodzenie|compensation|stawka|pay|rate|brutto|netto|gross|invoice|faktur/.test(
          lower,
        )
      )
        score += 4
      if (thousands) score += 2
      if (maxRaw) score += 2
      if (/experience|years? of|lat doświadc/.test(lower)) score -= 6
      candidates.push({
        salary: {
          min: Math.min(min, max),
          max: Math.max(min, max),
          currency,
          period,
          amountType,
        },
        evidence: line,
        score,
      })
    }
  }
  const best = candidates.sort((left, right) => right.score - left.score)[0]
  return best && best.score >= 4
    ? field(best.salary, best.score >= 8 ? "high" : "medium", "pattern", [
        best.evidence,
      ])
    : emptyField<SalaryRange>()
}

function extractContractTypes(text: string): ExtractedField<string[]> {
  const matches: string[] = []
  if (/\bb2b\b|business[- ]to[- ]business/i.test(text)) matches.push("B2B")
  if (
    /\buop\b|umow[ay] o prac[ęe]|contract of employment|employment contract/i.test(
      text,
    )
  )
    matches.push("UoP")
  if (/umow[ay] zlecen|contract of mandate/i.test(text))
    matches.push("Umowa zlecenie")
  if (/umow[ay] o dzieło|contract for specific work/i.test(text))
    matches.push("Umowa o dzieło")
  return matches.length
    ? field(unique(matches), "high", "pattern", [
        firstMatchingLine(text, /b2b|uop|umow|contract/i),
      ])
    : emptyField<string[]>()
}

function extractWorkMode(
  text: string,
): ExtractedField<"remote" | "hybrid" | "onsite"> {
  const line = firstMatchingLine(
    text,
    /remote|hybrid|on[- ]?site|office|zdaln|hybryd|stacjonarn|biur/i,
  )
  if (!line) return emptyField()
  if (/hybrid|hybryd/i.test(line))
    return field("hybrid", "high", "pattern", [line])
  if (/remote|zdaln/i.test(line))
    return field("remote", "high", "pattern", [line])
  if (/on[- ]?site|office|stacjonarn|biur/i.test(line))
    return field("onsite", "medium", "pattern", [line])
  return emptyField()
}

function extractOfficeDays(text: string): ExtractedField<number> {
  const match = text.match(
    /(?:at least\s*)?(\d)\s*(?:days?|dni)\s*(?:per week|a week|w tygodniu)?[^\n]{0,30}(?:office|biur)|(?:office|biur)[^\n]{0,30}?(\d)\s*(?:days?|dni)/i,
  )
  const value = Number(match?.[1] ?? match?.[2])
  return value >= 1 && value <= 7
    ? field(value, "high", "pattern", [match?.[0]])
    : emptyField<number>()
}

function extractSeniority(
  title: string | null,
  text: string,
): ExtractedField<string> {
  const source = `${title ?? ""}\n${text}`
  const patterns: Array<[RegExp, string]> = [
    [/\bprincipal\b/i, "Principal"],
    [/\b(head of|director)\b/i, "Head / Director"],
    [/\blead\b/i, "Lead"],
    [/\bsenior\b|\bsr\.?\b/i, "Senior"],
    [/\bmid(?:dle)?\b|regular/i, "Mid"],
    [/\bjunior\b|\bjr\.?\b/i, "Junior"],
  ]
  const found = patterns
    .filter(([pattern]) => pattern.test(source))
    .map(([, label]) => label)
  return found.length
    ? field(
        unique(found, 2).join(" / "),
        title ? "high" : "medium",
        "pattern",
        [
          title ??
            firstMatchingLine(
              text,
              /principal|head|director|lead|senior|junior|middle/i,
            ),
        ],
      )
    : emptyField<string>()
}

function extractExperience(text: string): ExtractedField<string> {
  const match =
    text.match(
      /(?:minimum|min\.?|at least|co najmniej)?\s*(\d{1,2})\s*\+?\s*(?:years?|yrs?|lat(?:a)?)\s+(?:of\s+)?(?:professional\s+)?experience/i,
    ) ??
    text.match(
      /(?:experience|doświadczeni[ae])[^\n]{0,40}?(\d{1,2})\s*\+?\s*(?:years?|yrs?|lat(?:a)?)/i,
    )
  if (!match) return emptyField()
  const plus =
    match[0].includes("+") ||
    /minimum|min\.?|at least|co najmniej/i.test(match[0])
  return field(`${match[1]}${plus ? "+" : ""} years`, "high", "pattern", [
    match[0],
  ])
}

function extractEnglish(text: string): ExtractedField<string> {
  const explicit = text.match(
    /(?:english|angielski)[^\n]{0,35}?\b([abc][12]\+?)(?=\s|$|[.,;)])/i,
  )
  if (explicit)
    return field(explicit[1].toUpperCase(), "high", "pattern", [explicit[0]])
  const descriptive = text.match(
    /(?:fluent|advanced|communicative)\s+english|english\s+(?:fluency|fluent|advanced|communicative)|angielski\s+(?:biegły|zaawansowany|komunikatywny)/i,
  )
  return descriptive
    ? field(descriptive[0], "medium", "pattern", [descriptive[0]])
    : emptyField<string>()
}

function extractTitle(
  text: string,
  metadataTitle?: string | null,
  heading?: string | null,
): ExtractedField<string> {
  const labelled = extractLabelledValue(text, [
    "job title",
    "position",
    "role",
    "stanowisko",
  ])
  if (heading) return field(cleanListItem(heading), "high", "meta", [heading])
  if (labelled) return field(labelled, "high", "pattern", [labelled])
  if (metadataTitle) {
    const cleaned = metadataTitle
      .split(/\s+[|·]\s+|\s+-\s+(?:job|praca|careers?)/i)[0]
      .trim()
    if (cleaned) return field(cleaned, "medium", "meta", [metadataTitle])
  }
  const candidate = text.split("\n").find((line) => {
    const normalized = normalizeHeading(line)
    return (
      line.length >= 3 &&
      line.length <= 100 &&
      !genericHeadings.has(normalized) &&
      !/^https?:/i.test(line) &&
      !/\b(?:salary|location|company|wynagrodzenie|lokalizacja|firma)\s*:/i.test(
        line,
      )
    )
  })
  return candidate
    ? field(cleanListItem(candidate), "low", "derived", [candidate])
    : emptyField<string>()
}

function createAnalysisId(input: ParseJobInput, text: string): string {
  const value = `${input.url ?? ""}\n${text}`
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `job-${(hash >>> 0).toString(36)}`
}

export function parseJobPosting(input: ParseJobInput): JobAnalysis {
  const metadataText = [
    input.metadata?.heading,
    input.metadata?.title,
    input.metadata?.description,
  ]
    .filter((value): value is string => Boolean(value))
    .join("\n")
  const text = normalizeJobText(`${metadataText}\n${input.text}`)
  if (text.length < 30) throw new Error("Job text is too short to analyze")

  const structured = collectJobPostings(input.jsonLd ?? [])[0] ?? null
  const structuredDescription = structured
    ? normalizeJobText(asString(structured.description) ?? "")
    : ""
  const analysisText = normalizeJobText(`${text}\n${structuredDescription}`)
  const sections = extractSections(analysisText)

  const structuredTitle = asString(structured?.title)
  const title = structuredTitle
    ? field(structuredTitle, "high", "json-ld", [structuredTitle])
    : extractTitle(analysisText, input.metadata?.title, input.metadata?.heading)
  const structuredCompany = getStructuredName(structured?.hiringOrganization)
  const companyValue =
    structuredCompany ??
    extractLabelledValue(analysisText, ["company", "firma", "pracodawca"])
  const structuredLocation = getStructuredLocation(structured?.jobLocation)
  const locationValue =
    structuredLocation ??
    extractLabelledValue(analysisText, [
      "location",
      "lokalizacja",
      "miejsce pracy",
    ]) ??
    firstMatchingLine(
      analysisText,
      /[\p{Lu}][\p{L}-]+(?:[ ,]+[\p{Lu}][\p{L}-]+){0,2},?\s+(?:Poland|Polska)\b/u,
    )

  const structuredSalary = parseStructuredSalary(structured?.baseSalary)
  const salary = structuredSalary
    ? field(structuredSalary, "high", "json-ld", [
        JSON.stringify(structured?.baseSalary).slice(0, 240),
      ])
    : parseSalary(analysisText)
  const structuredContracts = asStringList(structured?.employmentType)
  const contractTypes = structuredContracts.length
    ? field(structuredContracts, "high", "json-ld", structuredContracts)
    : extractContractTypes(analysisText)

  const jsonLocationType = asString(structured?.jobLocationType)
  const workMode =
    jsonLocationType && /telecommute|remote/i.test(jsonLocationType)
      ? field<"remote" | "hybrid" | "onsite">("remote", "high", "json-ld", [
          jsonLocationType,
        ])
      : extractWorkMode(analysisText)

  const requiredText = sections.requirements?.join("\n") ?? analysisText
  const niceText = sections.niceToHave?.join("\n") ?? ""
  const niceSkills = extractSkills(niceText)
  const requiredSkills = extractSkills(requiredText).filter(
    (skill) => !niceSkills.includes(skill),
  )
  const structuredSkills = asStringList(structured?.skills)
  const finalRequiredSkills = unique([...structuredSkills, ...requiredSkills])

  const structuredResponsibilities = asStringList(structured?.responsibilities)
  const responsibilities = unique(
    [...structuredResponsibilities, ...(sections.responsibilities ?? [])],
    8,
  )
  const structuredBenefits = asStringList(structured?.jobBenefits)
  const benefits = unique(
    [...structuredBenefits, ...(sections.benefits ?? [])],
    8,
  )

  return {
    id: createAnalysisId(input, analysisText),
    source: {
      kind: input.sourceKind,
      url: input.url ?? null,
      capturedAt: input.capturedAt ?? new Date().toISOString(),
    },
    title,
    company: companyValue
      ? field(
          companyValue,
          structuredCompany ? "high" : "medium",
          structuredCompany ? "json-ld" : "pattern",
          [companyValue],
        )
      : emptyField(),
    location: locationValue
      ? field(
          locationValue,
          structuredLocation ? "high" : "medium",
          structuredLocation ? "json-ld" : "pattern",
          [locationValue],
        )
      : emptyField(),
    workMode,
    officeDaysPerWeek: extractOfficeDays(analysisText),
    contractTypes,
    salary,
    seniority: extractSeniority(title.value, analysisText),
    experience: extractExperience(analysisText),
    english: extractEnglish(analysisText),
    requiredSkills: finalRequiredSkills.length
      ? field(
          finalRequiredSkills,
          structuredSkills.length ? "high" : "medium",
          structuredSkills.length ? "json-ld" : "section",
          [requiredText.slice(0, 240)],
        )
      : emptyField(),
    responsibilities: responsibilities.length
      ? field(
          responsibilities,
          structuredResponsibilities.length ? "high" : "medium",
          structuredResponsibilities.length ? "json-ld" : "section",
          responsibilities.slice(0, 2),
        )
      : emptyField(),
    niceToHave: niceSkills.length
      ? field(niceSkills, "medium", "section", [niceText.slice(0, 240)])
      : emptyField(),
    benefits: benefits.length
      ? field(
          benefits,
          structuredBenefits.length ? "high" : "medium",
          structuredBenefits.length ? "json-ld" : "section",
          benefits.slice(0, 2),
        )
      : emptyField(),
    warnings: [],
  }
}
