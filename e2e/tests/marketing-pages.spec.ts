import { expect, test } from '../fixtures/app.fixture'

test('informational pages expose their headings and active navigation state', async ({
  aboutPage,
  howItWorksPage,
}) => {
  await test.step('Verify the How it works page', async () => {
    await howItWorksPage.goto()
    await expect(howItWorksPage.heading).toBeVisible()
    await expect(howItWorksPage.activeNavigationLink).toHaveText('How it works')
  })

  // Both lightweight marketing routes share one smoke test to keep the suite compact.
  await test.step('Verify the About page', async () => {
    await aboutPage.goto()
    await expect(aboutPage.heading).toBeVisible()
    await expect(aboutPage.activeNavigationLink).toHaveText('About')
  })
})
