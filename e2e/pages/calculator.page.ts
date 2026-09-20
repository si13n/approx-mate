import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

/** Page object for the full salary calculator. */
export class CalculatorPage extends BasePage {
  readonly amountInput: Locator
  readonly currencySelect: Locator
  readonly grossMode: Locator
  readonly twentyThousandGrossScenario: Locator
  readonly resultHeading: Locator
  readonly b2bResult: Locator
  readonly uopResult: Locator

  constructor(page: Page) {
    super(page)
    this.amountInput = page.getByLabel('Amount', { exact: true })
    this.currencySelect = page.getByLabel('Currency')
    this.grossMode = page.getByRole('radio', { name: /Offered gross/ })
    this.twentyThousandGrossScenario = page.getByRole('button', {
      name: '20k PLN gross',
    })
    this.resultHeading = page.getByRole('heading', { level: 2 })
    this.b2bResult = page.getByRole('heading', { name: 'B2B', exact: true })
    this.uopResult = page.getByRole('heading', { name: 'UoP', exact: true })
  }

  /** Open the calculator and let Playwright wait for interactive controls. */
  async goto() {
    await this.open('/calculator')
    await this.amountInput.waitFor()
  }

  /** Apply the built-in scenario as a user would, instead of changing state directly. */
  async chooseTwentyThousandPlnGross() {
    await this.twentyThousandGrossScenario.click()
  }
}
