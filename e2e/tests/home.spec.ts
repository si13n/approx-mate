import { expect, test } from '../fixtures/app.fixture'

test('landing page recalculates salary and opens the full calculator', async ({
  homePage,
  page,
}) => {
  await test.step('Open the landing page and verify its main content', async () => {
    await homePage.goto()
    await expect(homePage.heading).toContainText('Know what the offer')
    await expect(homePage.grossAmount).toHaveText('22 000')
  })

  await test.step('Move the salary slider and verify the preview changes', async () => {
    const previousTakeHome = await homePage.takeHomeAmount.textContent()

    await homePage.setMonthlyGross(30_000)

    await expect(homePage.salarySlider).toHaveValue('30000')
    await expect(homePage.grossAmount).toHaveText('30 000')
    await expect(homePage.takeHomeAmount).not.toHaveText(previousTakeHome ?? '')
  })

  await test.step('Continue to the detailed calculator', async () => {
    await homePage.openDetailedCalculator()
    await expect(page).toHaveURL(/\/calculator$/)
  })
})
