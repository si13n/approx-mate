import { expect, test } from '../fixtures/app.fixture'

test('exchange-rate API rejects unsupported HTTP methods', async ({ request }) => {
  // POST never calls the external NBP service, which keeps this contract test deterministic.
  const response = await request.post('/api/exchange-rates')

  expect(response.status()).toBe(405)
  expect(response.headers().allow).toBe('GET')
  expect(await response.json()).toEqual({ error: 'Method not allowed' })
})
