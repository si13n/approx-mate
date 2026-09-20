import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

/** Page object for the About marketing page. */
export class AboutPage extends BasePage {
  readonly heading: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', {
      level: 1,
      name: /Career decisions are hard\. The numbers shouldn't be\./,
    })
  }

  /** Open the About page. */
  async goto() {
    await this.open('/about')
  }
}
