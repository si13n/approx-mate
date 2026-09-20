import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

/** Page object for the current Job X-RAY input screen. */
export class JobXRayPage extends BasePage {
  readonly heading: Locator
  readonly vacancyInput: Locator
  readonly analyzeButton: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { level: 1 })
    this.vacancyInput = page.getByLabel('Paste a link or job text')
    this.analyzeButton = page.getByRole('button', { name: 'Analyze offer' })
  }

  /** Open the Job X-RAY page. */
  async goto() {
    await this.open('/job-xray')
  }

  /** Enter a vacancy and submit the form through visible user controls. */
  async submitVacancy(vacancy: string) {
    await this.vacancyInput.fill(vacancy)
    await this.analyzeButton.click()
  }
}
