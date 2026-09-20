import type { Locator, Page } from '@playwright/test'

/**
 * BasePage contains elements and actions that are shared by every ApproxMate page.
 * Keeping shared navigation here prevents the same selectors from being copied
 * into every page object.
 */
export class BasePage {
  readonly page: Page
  readonly brandLink: Locator
  readonly languageSelect: Locator
  readonly activeNavigationLink: Locator

  constructor(page: Page) {
    this.page = page
    this.brandLink = page.getByRole('link', { name: 'ApproxMate' })
    this.languageSelect = page.getByLabel('Language')
    this.activeNavigationLink = page.locator('nav a[aria-current="page"]')
  }

  /** Open an application route and wait until its initial HTML is ready. */
  protected async open(path: string) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' })
  }
}
