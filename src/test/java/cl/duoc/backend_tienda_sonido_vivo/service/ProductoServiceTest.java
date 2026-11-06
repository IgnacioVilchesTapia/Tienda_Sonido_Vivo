package cl.duoc.backend_tienda_sonido_vivo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.duoc.backend_tienda_sonido_vivo.dto.ProductoDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.ConflictoException;
import cl.duoc.backend_tienda_sonido_vivo.exception.RecursoNoEncontradoException;
import cl.duoc.backend_tienda_sonido_vivo.model.Categoria;
import cl.duoc.backend_tienda_sonido_vivo.model.Producto;
import cl.duoc.backend_tienda_sonido_vivo.repository.CategoriaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.ProductoRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ProductoService productoService;

    private static Categoria guitarras() {
        Categoria c = new Categoria("Guitarras Eléctricas");
        c.setId(2L);
        return c;
    }

    private static Producto producto(String codigo, String nombre, String marca) {
        Producto p = new Producto();
        p.setCodigo(codigo);
        p.setNombre(nombre);
        p.setMarca(marca);
        p.setModelo("X");
        p.setPrecio(100000);
        p.setStock(5);
        p.setStockCritico(3);
        p.setDescuento(0);
        p.setCategoria(guitarras());
        return p;
    }

    private static ProductoDTO nuevo(String codigo, String categoria, Long categoriaId) {
        return new ProductoDTO(codigo, "Guitarra de prueba", "Squier", "Affinity", "desc",
                249990, 5, null, null, "/img/guitarras-electricas.jpg", categoria, categoriaId);
    }

    @Test
    void crearConCodigoRepetidoLanzaConflicto() {
        when(productoRepository.existsById("GE001")).thenReturn(true);

        assertThatThrownBy(() -> productoService.crear(nuevo("ge001", "Guitarras Eléctricas", null)))
                .isInstanceOf(ConflictoException.class);
        verify(productoRepository, never()).save(any());
    }

    @Test
    void crearConNombreDeCategoriaGuardaEnMayusculasYConValoresPorDefecto() {
        when(productoRepository.existsById("GE099")).thenReturn(false);
        when(categoriaRepository.findByNombreIgnoreCase("Guitarras Eléctricas")).thenReturn(Optional.of(guitarras()));
        when(productoRepository.save(any(Producto.class))).thenAnswer(inv -> inv.getArgument(0));

        ProductoDTO creado = productoService.crear(nuevo(" ge099 ", "Guitarras Eléctricas", null));

        assertThat(creado.codigo()).isEqualTo("GE099");
        assertThat(creado.categoria()).isEqualTo("Guitarras Eléctricas");
        assertThat(creado.stockCritico()).isEqualTo(3);
        assertThat(creado.descuento()).isZero();
    }

    @Test
    void crearSinCategoriaLanzaErrorDeDatos() {
        when(productoRepository.existsById("GE099")).thenReturn(false);

        assertThatThrownBy(() -> productoService.crear(nuevo("GE099", null, null)))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void obtenerProductoQueNoExisteLanza404() {
        when(productoRepository.findById("XX999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productoService.obtener("xx999"))
                .isInstanceOf(RecursoNoEncontradoException.class);
    }

    @Test
    void listarFiltraPorTextoEnNombreOMarca() {
        when(productoRepository.findAll()).thenReturn(List.of(
                producto("GE001", "Guitarra Eléctrica Stratocaster", "Squier"),
                producto("GE002", "Guitarra Eléctrica Les Paul", "Epiphone")));

        List<ProductoDTO> resultado = productoService.listar(null, "epiph");

        assertThat(resultado).extracting(ProductoDTO::codigo).containsExactly("GE002");
    }
}
