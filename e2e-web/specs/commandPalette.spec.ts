import { expect, test } from '@playwright/test'
import { openApp } from '../fixtures/app.ts'

test.describe('Command palette (headless)', () => {
  test('opens with Cmd+K and jumps to sections', async ({ page }) => {
    await openApp(page)

    await expect(page.getByTestId('command-palette')).toBeHidden()
    await page.keyboard.press('Meta+k')
    await expect(page.getByTestId('command-palette')).toBeVisible()

    const input = page.getByTestId('command-palette-input')
    await expect(input).toBeFocused()

    // Fuzzy filter narrows to the activity entry; Enter runs it.
    await input.fill('activ')
    await expect(page.getByTestId('activity-view')).toBeHidden()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('command-palette')).toBeHidden()
    await expect(page.getByTestId('activity-view')).toBeVisible()

    // Esc closes without navigating.
    await page.keyboard.press('Meta+k')
    await expect(page.getByTestId('command-palette')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('command-palette')).toBeHidden()
    await expect(page.getByTestId('activity-view')).toBeVisible()
  })

  test('chrome button opens the palette', async ({ page }) => {
    await openApp(page)

    await page.getByTestId('chrome-palette').click()
    await expect(page.getByTestId('command-palette')).toBeVisible()
    await expect(page.getByTestId('command-palette-input')).toBeFocused()
  })
})
