package cl.duoc.backend_tienda_sonido_vivo.service;

import cl.duoc.backend_tienda_sonido_vivo.dto.ResumenDTO;
import cl.duoc.backend_tienda_sonido_vivo.model.Boleta;
import cl.duoc.backend_tienda_sonido_vivo.model.Categoria;
import cl.duoc.backend_tienda_sonido_vivo.model.DetalleBoleta;
import cl.duoc.backend_tienda_sonido_vivo.model.EstadoBoleta;
import cl.duoc.backend_tienda_sonido_vivo.model.Producto;
import cl.duoc.backend_tienda_sonido_vivo.repository.BoletaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.CategoriaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.ProductoRepository;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReporteService {

    private final BoletaRepository boletaRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ReporteService(BoletaRepository boletaRepository,
                          ProductoRepository productoRepository,
                          CategoriaRepository categoriaRepository) {
        this.boletaRepository = boletaRepository;
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public ResumenDTO generarResumen() {
        List<Boleta> boletasValidas = boletaRepository.findAll().stream()
                .filter(b -> b.getEstado() != EstadoBoleta.ANULADA)
                .toList();

        long totalVentas = boletasValidas.stream()
                .mapToLong(Boleta::getTotal)
                .sum();

        long comprasPagadas = boletasValidas.size();

        long ticketPromedio = comprasPagadas > 0
                ? Math.round((double) totalVentas / comprasPagadas)
                : 0L;

        Map<String, Long> ventasPorCategoria = new LinkedHashMap<>();
        Map<String, Long> vendidosPorProducto = new HashMap<>();

        for (Boleta boleta : boletasValidas) {
            for (DetalleBoleta detalle : boleta.getDetalles()) {
                Producto p = detalle.getProducto();
                String nombreProd = p.getNombre();
                String nombreCat = p.getCategoria() != null ? p.getCategoria().getNombre() : "Otros";

                long subtotal = detalle.getSubtotal() != null ? detalle.getSubtotal() : 0L;
                long cant = detalle.getCantidad() != null ? detalle.getCantidad() : 0L;

                ventasPorCategoria.put(nombreCat, ventasPorCategoria.getOrDefault(nombreCat, 0L) + subtotal);
                vendidosPorProducto.put(nombreProd, vendidosPorProducto.getOrDefault(nombreProd, 0L) + cant);
            }
        }

        List<ResumenDTO.ProductoVendido> masVendidos = vendidosPorProducto.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> new ResumenDTO.ProductoVendido(e.getKey(), e.getValue()))
                .toList();

        List<Producto> todosLosProductos = productoRepository.findAll();
        List<Categoria> todasLasCategorias = categoriaRepository.findAll();

        List<ResumenDTO.InventarioCategoria> inventario = todasLasCategorias.stream().map(cat -> {
            List<Producto> deEstaCat = todosLosProductos.stream()
                    .filter(p -> p.getCategoria() != null && p.getCategoria().getId().equals(cat.getId()))
                    .toList();
            int cantidadProductos = deEstaCat.size();
            int unidades = deEstaCat.stream().mapToInt(Producto::getStock).sum();
            long valor = deEstaCat.stream().mapToLong(p -> (long) p.getStock() * p.getPrecio()).sum();
            return new ResumenDTO.InventarioCategoria(cat.getNombre(), cantidadProductos, unidades, valor);
        }).toList();

        return new ResumenDTO(
                totalVentas,
                comprasPagadas,
                ticketPromedio,
                ventasPorCategoria,
                masVendidos,
                inventario
        );
    }
}
