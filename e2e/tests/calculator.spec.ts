import { expect, test } from '../fixtures/app.fixture'

test('calculator applies a gross PLN scenario and shows both contract results', async ({
  calculatorPage,
}) => {
  await calculatorPage.goto()

  // Use a public quick-scenario control so the test follows the real user flow.
  await calculatorPage.chooseTwentyThousandPlnGross()

  await expect(calculatorPage.amountInput).toHaveValue('20,000')
  await expect(calculatorPage.currencySelect).toHaveValue('PLN')
  await expect(calculatorPage.grossMode).toHaveAttribute('aria-checked', 'true')
  await expect(calculatorPage.resultHeading).toContainText(
    'Offered gross 20,000 PLN / month',
  )
  await expect(calculatorPage.b2bResult).toBeVisible()
  await expect(calculatorPage.uopResult).toBeVisible()
})
