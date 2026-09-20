import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

/** Page object for the How it works marketing page. */
export class HowItWorksPage extends BasePage {
  readonly heading: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', {
      level: 1,
      name: 'From offer to decision in minutes.',
    })
  }

  /** Open the How it works page. */
  async goto() {
    await this.open('/how-it-works')
  }
}
