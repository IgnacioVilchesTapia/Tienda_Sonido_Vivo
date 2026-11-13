package cl.duoc.backend_tienda_sonido_vivo.dto;

import java.util.List;
import java.util.Map;

public record ResumenDTO(
        long totalVentas,
        long comprasPagadas,
        long ticketPromedio,
        Map<String, Long> ventasPorCategoria,
        List<ProductoVendido> masVendidos,
        List<InventarioCategoria> inventario
) {
    public record ProductoVendido(String nombre, long cantidad) {
    }

    public record InventarioCategoria(String categoria, String cat, int productos, int unidades, long valor) {
        public InventarioCategoria(String categoria, int productos, int unidades, long valor) {
            this(categoria, categoria, productos, unidades, valor);
        }
    }
}
