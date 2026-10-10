import { test, expect } from '@playwright/test'

test.describe('Navegación general', () => {
  test('la página de inicio muestra el título y el encabezado principal', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Sonido Vivo/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tu pasión por la música')
  })

  test('el menú superior lleva a Catálogo, Nosotros y Contacto', async ({ page }) => {
    await page.goto('/')
    const menu = page.locator('header')

    await menu.getByRole('link', { name: 'Catálogo' }).click()
    await expect(page).toHaveURL(/\/productos$/)
    await expect(page.getByRole('heading', { name: 'Catálogo de Instrumentos' })).toBeVisible()

    await menu.getByRole('link', { name: 'Nosotros' }).click()
    await expect(page).toHaveURL(/\/nosotros$/)

    await menu.getByRole('link', { name: 'Contacto' }).click()
    await expect(page).toHaveURL(/\/contacto$/)
    await expect(page.getByRole('heading', { name: /Contacto & Asistencia/ })).toBeVisible()
  })

  test('una ruta inexistente muestra la página 404 y permite volver al inicio', async ({ page }) => {
    await page.goto('/ruta-que-no-existe')
    await expect(page.getByRole('heading', { name: /404/ })).toBeVisible()

    await page.getByRole('link', { name: /Volver al Inicio/ }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tu pasión por la música')
  })
})