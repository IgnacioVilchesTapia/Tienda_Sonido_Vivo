package cl.duoc.backend_tienda_sonido_vivo.dto;

import cl.duoc.backend_tienda_sonido_vivo.model.DetalleBoleta;

public record DetalleBoletaDTO(String codigo, String nombre, Integer cantidad, Integer precioUnitario, Integer subtotal) {

    public static DetalleBoletaDTO desde(DetalleBoleta d) {
        return new DetalleBoletaDTO(
                d.getProducto().getCodigo(),
                d.getProducto().getNombre(),
                d.getCantidad(),
                d.getPrecioUnitario(),
                d.getSubtotal()
        );
    }
}
