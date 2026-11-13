package cl.duoc.backend_tienda_sonido_vivo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import cl.duoc.backend_tienda_sonido_vivo.dto.ResumenDTO;
import cl.duoc.backend_tienda_sonido_vivo.model.Boleta;
import cl.duoc.backend_tienda_sonido_vivo.model.Categoria;
import cl.duoc.backend_tienda_sonido_vivo.model.DetalleBoleta;
import cl.duoc.backend_tienda_sonido_vivo.model.EstadoBoleta;
import cl.duoc.backend_tienda_sonido_vivo.model.Producto;
import cl.duoc.backend_tienda_sonido_vivo.repository.BoletaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.CategoriaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.ProductoRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ReporteServiceTest {

    @Mock
    private BoletaRepository boletaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ReporteService reporteService;

    @Test
    void generarResumen_calculaTotalesCorrectamente() {
        Categoria guitarras = new Categoria("Guitarras");
        guitarras.setId(1L);

        Producto strat = new Producto();
        strat.setCodigo("STRAT01");
        strat.setNombre("Fender Stratocaster");
        strat.setCategoria(guitarras);
        strat.setPrecio(500000);
        strat.setStock(5);

        DetalleBoleta det = new DetalleBoleta();
        det.setProducto(strat);
        det.setCantidad(2);
        det.setPrecioUnitario(500000);
        det.setSubtotal(1000000);

        Boleta boleta = new Boleta();
        boleta.setNumero(1L);
        boleta.setEstado(EstadoBoleta.PAGADA);
        boleta.setTotal(1000000);
        boleta.getDetalles().add(det);

        when(boletaRepository.findAll()).thenReturn(List.of(boleta));
        when(categoriaRepository.findAll()).thenReturn(List.of(guitarras));
        when(productoRepository.findAll()).thenReturn(List.of(strat));

        ResumenDTO resumen = reporteService.generarResumen();

        assertThat(resumen.totalVentas()).isEqualTo(1000000L);
        assertThat(resumen.comprasPagadas()).isEqualTo(1L);
        assertThat(resumen.ticketPromedio()).isEqualTo(1000000L);
        assertThat(resumen.ventasPorCategoria()).containsEntry("Guitarras", 1000000L);
        assertThat(resumen.masVendidos()).hasSize(1);
        assertThat(resumen.masVendidos().get(0).nombre()).isEqualTo("Fender Stratocaster");
        assertThat(resumen.masVendidos().get(0).cantidad()).isEqualTo(2L);
        assertThat(resumen.inventario()).hasSize(1);
        assertThat(resumen.inventario().get(0).categoria()).isEqualTo("Guitarras");
        assertThat(resumen.inventario().get(0).unidades()).isEqualTo(5);
        assertThat(resumen.inventario().get(0).valor()).isEqualTo(2500000L);
    }

    @Test
    void generarResumen_sinVentas_retornaTotalesEnCero() {
        when(boletaRepository.findAll()).thenReturn(List.of());
        when(categoriaRepository.findAll()).thenReturn(List.of());
        when(productoRepository.findAll()).thenReturn(List.of());

        ResumenDTO resumen = reporteService.generarResumen();

        assertThat(resumen.totalVentas()).isEqualTo(0L);
        assertThat(resumen.comprasPagadas()).isEqualTo(0L);
        assertThat(resumen.ticketPromedio()).isEqualTo(0L);
        assertThat(resumen.masVendidos()).isEmpty();
        assertThat(resumen.inventario()).isEmpty();
    }
}
