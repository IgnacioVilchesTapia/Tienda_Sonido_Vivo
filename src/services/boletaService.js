import api from './api';

export const ESTADOS = [
    { valor: 'PAGADA', etiqueta: 'Pagada', color: 'bg-success' },
    { valor: 'ENVIADA', etiqueta: 'Enviada', color: 'bg-primary' },
    { valor: 'ENTREGADA', etiqueta: 'Entregada', color: 'bg-dark' },
    { valor: 'ANULADA', etiqueta: 'Anulada', color: 'bg-danger' }
];

export function buscarEstado(valor) {
    return ESTADOS.find((e) => e.valor === valor) || { valor: valor, etiqueta: valor, color: 'bg-secondary' };
}

export function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}

export async function crearCompra(compra) {
    const respuesta = await api.post('/boletas', compra);
    return respuesta.data;
}

export async function listarBoletas() {
    const respuesta = await api.get('/boletas');
    return respuesta.data;
}

export async function obtenerBoleta(numero) {
    const respuesta = await api.get('/boletas/' + numero);
    return respuesta.data;
}

export async function cambiarEstadoBoleta(numero, estado) {
    const respuesta = await api.put('/boletas/' + numero + '/estado', { estado: estado });
    return respuesta.data;
}

export async function anularBoleta(numero) {
    const respuesta = await api.delete('/boletas/' + numero);
    return respuesta.data;
}
