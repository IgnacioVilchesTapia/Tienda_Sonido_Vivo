import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Checkout from './Checkout';
import api from '../services/api';

function tokenFalso() {
    const exp = Math.floor(Date.now() / 1000) + 600;
    return 'cabecera.' + btoa(JSON.stringify({ exp: exp })) + '.firma';
}

function prepararClienteConCarrito() {
    localStorage.setItem('sonidoVivo.token', tokenFalso());
    localStorage.setItem('sonidoVivo.refreshToken', tokenFalso());
    localStorage.setItem('sonidoVivo.usuario', JSON.stringify({
        nombre: 'Fernanda', apellidos: 'Soto Lagos', correo: 'fsoto2000@gmail.com', rol: 'CLIENTE',
        direccion: 'Irarrázaval 1200', region: 'Región Metropolitana de Santiago', comuna: 'Ñuñoa'
    }));
    localStorage.setItem('sonidoVivo.carrito', JSON.stringify([
        { codigo: 'GA001', nombre: 'Guitarra Acústica Folk', precio: 129990, stock: 8, cantidad: 2, imagen: '' }
    ]));
}

function renderCheckout() {
    return render(
        <MemoryRouter initialEntries={['/checkout']}>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/compra-exitosa" element={<div>COMPRA EXITOSA</div>} />
                        <Route path="/pago-error" element={<div>PAGO RECHAZADO</div>} />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </MemoryRouter>
    );
}

describe('Checkout', () => {
    let user;
    beforeEach(() => {
        localStorage.clear();
        prepararClienteConCarrito();
        user = userEvent.setup();
    });
    afterEach(() => localStorage.clear());

    const pagar = () => user.click(screen.getByRole('button', { name: /Pagar ahora/i }));

    it('manda al backend solo los códigos y las cantidades', async () => {
        spyOn(Math, 'random').and.returnValue(0.9);
        spyOn(api, 'post').and.callFake(() => Promise.resolve({ data: { numero: 1 } }));
        renderCheckout();
        await pagar();
        expect(await screen.findByText('COMPRA EXITOSA')).toBeTruthy();
        const cuerpo = api.post.calls.mostRecent().args[1];
        expect(api.post.calls.mostRecent().args[0]).toBe('/boletas');
        expect(cuerpo.items).toEqual([{ codigo: 'GA001', cantidad: 2 }]);
        expect(cuerpo.direccion.comuna).toBe('Ñuñoa');
    });

    it('si el banco rechaza el pago no llama al backend', async () => {
        spyOn(Math, 'random').and.returnValue(0.1);
        spyOn(api, 'post');
        renderCheckout();
        await pagar();
        expect(screen.getByText('PAGO RECHAZADO')).toBeTruthy();
        expect(api.post).not.toHaveBeenCalled();
    });

    it('muestra el error del servidor si falta stock', async () => {
        spyOn(Math, 'random').and.returnValue(0.9);
        spyOn(api, 'post').and.callFake(() => Promise.reject({
            response: { status: 409, data: { mensaje: 'Stock insuficiente para GA001: quedan 1' } }
        }));
        renderCheckout();
        await pagar();
        expect(await screen.findByText('Stock insuficiente para GA001: quedan 1')).toBeTruthy();
    });
});
