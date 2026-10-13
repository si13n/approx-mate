import { expect, test } from '../fixtures/app.fixture'

test('Job X-RAY accepts vacancy text without leaving the page', async ({
  jobXRayPage,
  page,
}) => {
  const vacancy = 'Senior QA Engineer with Playwright and TypeScript'

  await jobXRayPage.goto()
  await expect(jobXRayPage.heading).toContainText('See the whole offer')

  // The design preview is static, so submitting preserves the input and the page.
  await jobXRayPage.submitVacancy(vacancy)

  await expect(jobXRayPage.vacancyInput).toHaveValue(vacancy)
  await expect(page).toHaveURL(/\/job-xray$/)
})
