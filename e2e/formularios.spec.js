import { test, expect } from '@playwright/test'

test.describe('Formularios', () => {
  test('el login con campos vacíos muestra los errores de validación', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('button', { name: 'Ingresar a Sonido Vivo' }).click()

    await expect(page.getByText('El correo electrónico es obligatorio.')).toBeVisible()
    await expect(page.getByText('La contraseña es obligatoria.')).toBeVisible()
  })

  test('el login rechaza correos de un dominio no permitido', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder('ejemplo@duoc.cl').fill('persona@hotmail.com')
    await page.getByPlaceholder('Entre 4 y 10 caracteres').fill('1234')
    await page.getByRole('button', { name: 'Ingresar a Sonido Vivo' }).click()

    await expect(page.getByText(/Dominio no permitido/)).toBeVisible()
  })

  test('un usuario admin entra al panel de control', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder('ejemplo@duoc.cl').fill('admin@duoc.cl')
    await page.getByPlaceholder('Entre 4 y 10 caracteres').fill('1234')
    await page.getByRole('button', { name: 'Ingresar a Sonido Vivo' }).click()

    await expect(page).toHaveURL(/\/admin\/dashboard$/)
    await expect(page.getByRole('heading', { name: /Panel de Control/ })).toBeVisible()
  })

  test('el formulario de contacto valida y luego envía el mensaje', async ({ page }) => {
    await page.goto('/contacto')

    await page.getByRole('button', { name: 'Enviar Consulta' }).click()
    await expect(page.getByText('El nombre es obligatorio.')).toBeVisible()

    await page.getByPlaceholder('Tu nombre y apellido').fill('Ana Pérez')
    await page.getByPlaceholder('ejemplo@duoc.cl o @gmail.com').fill('ana@gmail.com')
    await page.locator('textarea').fill('Hola, quiero consultar por una guitarra.')
    await page.getByRole('button', { name: 'Enviar Consulta' }).click()

    await expect(page.getByText(/Mensaje enviado con éxito/)).toBeVisible()
  })
})