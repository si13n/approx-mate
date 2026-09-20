import { test as base } from '@playwright/test'
import { AboutPage } from '../pages/about.page'
import { CalculatorPage } from '../pages/calculator.page'
import { HomePage } from '../pages/home.page'
import { HowItWorksPage } from '../pages/how-it-works.page'
import { JobXRayPage } from '../pages/job-xray.page'

/**
 * Custom fixture types make page objects available by name in every test.
 * Playwright creates fresh objects for every test, so state cannot leak between tests.
 */
type AppFixtures = {
  aboutPage: AboutPage
  calculatorPage: CalculatorPage
  homePage: HomePage
  howItWorksPage: HowItWorksPage
  jobXRayPage: JobXRayPage
}

export const test = base.extend<AppFixtures>({
  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page))
  },
  calculatorPage: async ({ page }, use) => {
    await use(new CalculatorPage(page))
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  howItWorksPage: async ({ page }, use) => {
    await use(new HowItWorksPage(page))
  },
  jobXRayPage: async ({ page }, use) => {
    await use(new JobXRayPage(page))
  },
})

// Re-export expect so tests need only one import from the project fixture.
export { expect } from '@playwright/test'
