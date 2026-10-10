import { test, expect } from '@playwright/test'

// Cada test de Playwright usa un navegador limpio, así que el carrito (localStorage) parte vacío.
async function agregarPrimerProducto(page) {
  await page.goto('/productos')
  await page.getByRole('button', { name: 'Agregar al Carrito' }).first().click()
  // Esperamos el aviso para asegurar que el carrito ya se guardó antes de cambiar de página
  await expect(page.getByRole('alert')).toBeVisible()
}

test.describe('Carrito de compras', () => {
  test('agregar un producto actualiza el aviso, el contador y el total del carrito', async ({ page }) => {
    await agregarPrimerProducto(page)

    await expect(page.getByRole('alert')).toContainText('Guitarra Acústica Folk')
    await expect(page.locator('header').getByRole('link', { name: /Carrito/ })).toContainText('1')

    await page.locator('header').getByRole('link', { name: /Carrito/ }).click()
    await expect(page.getByRole('heading', { name: 'Mi Carrito de Compras' })).toBeVisible()
    // $129.990 + $4.990 de despacho
    await expect(page.getByText('$134.980')).toBeVisible()
  })

  test('un cupón válido aplica el descuento', async ({ page }) => {
    await agregarPrimerProducto(page)
    await page.goto('/carrito')

    await page.getByPlaceholder('Ej: SONIDOVIVO10').fill('SONIDOVIVO10')
    await page.getByRole('button', { name: 'Aplicar' }).click()

    await expect(page.getByText('-$12.999')).toBeVisible()
    // 129.990 - 12.999 + 4.990
    await expect(page.getByText('$121.981')).toBeVisible()
  })

  test('un cupón inválido muestra un error', async ({ page }) => {
    await agregarPrimerProducto(page)
    await page.goto('/carrito')

    await page.getByPlaceholder('Ej: SONIDOVIVO10').fill('FALSO')
    await page.getByRole('button', { name: 'Aplicar' }).click()

    await expect(page.getByText('El cupón ingresado no es válido o ha expirado.')).toBeVisible()
  })

  test('eliminar el producto deja el carrito vacío', async ({ page }) => {
    await agregarPrimerProducto(page)
    await page.goto('/carrito')

    await page.getByTitle('Eliminar producto').click()

    await expect(page.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeVisible()
  })

  test('finalizar la compra muestra el mensaje de agradecimiento', async ({ page }) => {
    await agregarPrimerProducto(page)
    await page.goto('/carrito')

    await page.getByRole('button', { name: 'Proceder al Pago' }).click()

    await expect(page.getByRole('heading', { name: /Gracias por tu compra/ })).toBeVisible()
  })
})