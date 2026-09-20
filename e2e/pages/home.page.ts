import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

/** Page object for the landing page and its lightweight salary preview. */
export class HomePage extends BasePage {
  readonly heading: Locator
  readonly salarySlider: Locator
  readonly grossAmount: Locator
  readonly takeHomeAmount: Locator
  readonly detailedCalculatorButton: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { level: 1 })
    this.salarySlider = page.getByRole('slider', {
      name: 'Monthly gross salary in PLN',
    })
    this.grossAmount = page.locator('.home-amount__value')
    this.takeHomeAmount = page.locator('.home-result__value')
    this.detailedCalculatorButton = page.getByRole('button', {
      name: 'Calculate in detail',
    })
  }

  /** Open the landing page through Playwright's configured base URL. */
  async goto() {
    await this.open('/')
  }

  /**
   * A range input cannot be filled like a text box, so we set its value in the
   * browser and dispatch an input event exactly as a real slider interaction does.
   */
  async setMonthlyGross(amount: number) {
    await this.salarySlider.evaluate((element, value) => {
      const slider = element as HTMLInputElement
      const setNativeValue = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )?.set

      // Use the native setter so React notices the value change before the event.
      setNativeValue?.call(slider, String(value))
      slider.dispatchEvent(new Event('input', { bubbles: true }))
      slider.dispatchEvent(new Event('change', { bubbles: true }))
    }, amount)
  }

  /** Continue from the landing-page preview to the full calculator. */
  async openDetailedCalculator() {
    await this.detailedCalculatorButton.click()
  }
}
