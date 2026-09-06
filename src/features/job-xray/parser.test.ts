import { describe, expect, it } from "vitest"
import { normalizeJobText, parseJobPosting } from "./parser"

const englishVacancy = `
Senior QA Lead
Company: Acme
Location: Kraków, Poland
Work model: Hybrid, 3 days in the office
Contract: B2B
Salary: 24–28k PLN gross / month
Experience: at least 5+ years of experience
English: B2+

Required skills
- Python
- Playwright
- API testing
- CI/CD
- Team leadership

Responsibilities
- Define QA strategy
- Lead automation initiatives
- Mentor QA engineers

Nice to have
- Kubernetes
- AWS
- Performance testing

Benefits
- Private medical care
- Sport card
`

describe("deterministic job parser", () => {
  it("normalizes job-post formatting without losing section boundaries", () => {
    expect(
      normalizeJobText("Required skills\r\n•  Python\u00a0  and  Playwright"),
    ).toBe("Required skills\n• Python and Playwright")
  })

  it("extracts the designed English vacancy fields", () => {
    const result = parseJobPosting({
      text: englishVacancy,
      sourceKind: "text",
      capturedAt: "2026-09-03T00:00:00.000Z",
    })

    expect(result.title.value).toBe("Senior QA Lead")
    expect(result.company.value).toBe("Acme")
    expect(result.location.value).toBe("Kraków, Poland")
    expect(result.workMode.value).toBe("hybrid")
    expect(result.officeDaysPerWeek.value).toBe(3)
    expect(result.contractTypes.value).toContain("B2B")
    expect(result.salary.value).toEqual({
      min: 24000,
      max: 28000,
      currency: "PLN",
      period: "month",
      amountType: "gross",
    })
    expect(result.seniority.value).toBe("Lead / Senior")
    expect(result.experience.value).toBe("5+ years")
    expect(result.english.value).toBe("B2+")
    expect(result.requiredSkills.value).toEqual([
      "Python",
      "Playwright",
      "API testing",
      "CI/CD",
      "Team leadership",
    ])
    expect(result.niceToHave.value).toEqual([
      "Performance testing",
      "AWS",
      "Kubernetes",
    ])
    expect(result.responsibilities.value).toContain("Define QA strategy")
    expect(result.benefits.value).toContain("Private medical care")
  })

  it("extracts Polish aliases and a single hourly salary", () => {
    const result = parseJobPosting({
      text: `
        Stanowisko: Automation Tester
        Firma: Example Polska
        Lokalizacja: Warszawa, Polska
        Tryb pracy: praca zdalna
        Umowa o pracę
        Wynagrodzenie: 150 PLN brutto / godz.
        Język angielski C1
        Wymagania
        - TypeScript
        - Cypress
        Obowiązki
        - Tworzenie testów automatycznych
        Mile widziane
        - Docker
      `,
      sourceKind: "text",
    })

    expect(result.title.value).toBe("Automation Tester")
    expect(result.company.value).toBe("Example Polska")
    expect(result.workMode.value).toBe("remote")
    expect(result.contractTypes.value).toContain("UoP")
    expect(result.salary.value).toMatchObject({
      min: 150,
      max: 150,
      currency: "PLN",
      period: "hour",
      amountType: "gross",
    })
    expect(result.requiredSkills.value).toEqual(["TypeScript", "Cypress"])
    expect(result.niceToHave.value).toEqual(["Docker"])
  })

  it("keeps full four-digit salary amounts", () => {
    const result = parseJobPosting({
      text: "QA Engineer\nSalary: $5000-$7000 gross / month\nRequired skills\n- Playwright",
      sourceKind: "text",
    })

    expect(result.salary.value).toMatchObject({ min: 5000, max: 7000 })
  })

  it("prefers schema.org JobPosting data over text guesses", () => {
    const result = parseJobPosting({
      text: "Different title\nSalary: 10k PLN net / month\nThis is a remote role with Python.",
      sourceKind: "url",
      url: "https://example.com/jobs/qa",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: "QA Engineering Manager",
          hiringOrganization: { name: "Schema Company" },
          employmentType: "FULL_TIME",
          jobLocation: {
            address: { addressLocality: "Gdańsk", addressCountry: "Poland" },
          },
          jobLocationType: "TELECOMMUTE",
          baseSalary: {
            currency: "PLN",
            value: { minValue: 30000, maxValue: 35000, unitText: "MONTH" },
          },
          skills: "Python; Playwright",
        },
      ],
    })

    expect(result.title.value).toBe("QA Engineering Manager")
    expect(result.title.method).toBe("json-ld")
    expect(result.company.value).toBe("Schema Company")
    expect(result.location.value).toBe("Gdańsk, Poland")
    expect(result.workMode.value).toBe("remote")
    expect(result.salary.value?.min).toBe(30000)
    expect(result.requiredSkills.value).toEqual(["Python", "Playwright"])
  })

  it("does not invent missing facts", () => {
    const result = parseJobPosting({
      text: "QA Engineer\nJoin our product team and help us improve release quality.",
      sourceKind: "text",
    })

    expect(result.title.value).toBe("QA Engineer")
    expect(result.salary.value).toBeNull()
    expect(result.company.value).toBeNull()
    expect(result.contractTypes.value).toBeNull()
    expect(result.benefits.value).toBeNull()
  })

  it("rejects content that is too short to be a vacancy", () => {
    expect(() =>
      parseJobPosting({ text: "QA role", sourceKind: "text" }),
    ).toThrow("too short")
  })
})
