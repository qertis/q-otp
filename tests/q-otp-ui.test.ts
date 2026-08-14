import { createApp, nextTick, type App as VueApp } from 'vue'
import { expect, afterEach, beforeEach, describe, test } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { Quasar } from 'quasar'
import App from './App.vue'

let app: VueApp

beforeEach(async () => {
  document.body.replaceChildren()
  const target = document.createElement('div')
  document.body.append(target)

  app = createApp(App).use(Quasar)
  app.mount(target)
  await nextTick()
})

afterEach(() => {
  app.unmount()
})

describe('QOtp UI', () => {
  test('renders a compact desktop OTP control', async () => {
    await page.viewport(900, 700)

    const inputs = page.getByRole('textbox')
    expect(inputs.all()).toHaveLength(6)

    for (let index = 0; index < 6; index++) {
      const input = inputs.nth(index)
      await expect.element(input).toHaveAttribute('type', 'text')
      await expect.element(input).toHaveAttribute('inputmode', 'numeric')
      await expect.element(input).toHaveStyle({ width: '48px' })
    }

    await expect(page.getByRole('main')).toMatchScreenshot('q-otp-desktop')
  })

  test('accepts all six digits and allows Backspace afterwards', async () => {
    const inputs = page.getByRole('textbox')
    await inputs.nth(0).click()

    for (const [index, digit] of [...'123456'].entries()) {
      await userEvent.keyboard(digit)
      await expect.element(inputs.nth(index)).toHaveValue(digit)

      if (index < 5) {
        await expect.element(inputs.nth(index + 1)).toHaveFocus()
      }
    }

    await userEvent.keyboard('{Backspace}')
    await expect.element(inputs.nth(5)).toHaveValue('')

    await userEvent.keyboard('{Backspace}')
    await expect.element(inputs.nth(4)).toHaveValue('')
  })
})
