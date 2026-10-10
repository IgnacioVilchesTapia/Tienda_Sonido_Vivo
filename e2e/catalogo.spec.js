import { test, expect } from '@playwright/test'

test.describe('Catálogo de productos', () => {
  test('el buscador filtra los productos por nombre', async ({ page }) => {
    await page.goto('/productos')
    await expect(page.getByRole('heading', { name: 'Guitarra Acústica Folk', exact: true })).toBeVisible()

    await page.getByRole('searchbox').fill('Stratocaster')

    await expect(page.getByRole('heading', { name: 'Guitarra Eléctrica Stratocaster' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Guitarra Acústica Folk', exact: true })).toHaveCount(0)
  })

  test('el filtro de categoría muestra solo los productos de esa categoría', async ({ page }) => {
    await page.goto('/productos')

    await page.locator('select').first().selectOption('Baterías')

    await expect(page).toHaveURL(/categoria=/)
    await expect(page.getByRole('heading', { name: 'Batería Acústica 5 piezas' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Guitarra Acústica Folk', exact: true })).toHaveCount(0)
  })

  test('una búsqueda sin resultados muestra un mensaje y se puede limpiar', async ({ page }) => {
    await page.goto('/productos')

    await page.getByRole('searchbox').fill('zzzz-no-existe')
    await expect(page.getByRole('heading', { name: 'No se encontraron productos' })).toBeVisible()

    await page.getByRole('button', { name: 'Ver todo el catálogo' }).click()
    await expect(page.getByRole('heading', { name: 'Guitarra Acústica Folk', exact: true })).toBeVisible()
  })

  test('desde el catálogo se puede abrir el detalle de un producto', async ({ page }) => {
    await page.goto('/productos')

    await page.getByRole('link', { name: 'Ver Detalle' }).first().click()

    await expect(page).toHaveURL(/\/producto\/GA001$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guitarra Acústica Folk')
  })

  test('un producto inexistente muestra el mensaje de error', async ({ page }) => {
    await page.goto('/producto/NOEXISTE')
    await expect(page.getByRole('heading', { name: 'Producto no encontrado' })).toBeVisible()
  })
})