package cl.duoc.backend_tienda_sonido_vivo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.duoc.backend_tienda_sonido_vivo.dto.BoletaDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.CompraDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.DireccionDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.ItemCompraDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.ConflictoException;
import cl.duoc.backend_tienda_sonido_vivo.model.Boleta;
import cl.duoc.backend_tienda_sonido_vivo.model.Categoria;
import cl.duoc.backend_tienda_sonido_vivo.model.DetalleBoleta;
import cl.duoc.backend_tienda_sonido_vivo.model.EstadoBoleta;
import cl.duoc.backend_tienda_sonido_vivo.model.Producto;
import cl.duoc.backend_tienda_sonido_vivo.model.Rol;
import cl.duoc.backend_tienda_sonido_vivo.model.Usuario;
import cl.duoc.backend_tienda_sonido_vivo.repository.BoletaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.ProductoRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BoletaServiceTest {

    @Mock
    private BoletaRepository boletaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private BoletaService boletaService;

    private final DireccionDTO direccion = new DireccionDTO("Av. Pajaritos 3020", "", "Región Metropolitana de Santiago", "Maipú", "");

    @BeforeEach
    void prepararCliente() {
        Usuario cliente = new Usuario();
        cliente.setRun("213334441");
        cliente.setNombre("Fernanda");
        cliente.setApellidos("Soto Lagos");
        cliente.setCorreo("fsoto2000@gmail.com");
        cliente.setRol(Rol.CLIENTE);
        when(usuarioRepository.findByCorreoIgnoreCase("fsoto2000@gmail.com")).thenReturn(Optional.of(cliente));
    }

    private Producto producto(String codigo, int precio, int stock, int descuento) {
        Producto p = new Producto();
        p.setCodigo(codigo);
        p.setNombre("Producto " + codigo);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setStockCritico(1);
        p.setDescuento(descuento);
        p.setCategoria(new Categoria("Guitarras Acústicas"));
        when(productoRepository.findById(codigo)).thenReturn(Optional.of(p));
        return p;
    }

    private void guardarDevuelveLaMisma() {
        when(boletaRepository.save(any(Boleta.class))).thenAnswer(invocacion -> invocacion.getArgument(0));
    }

    @Test
    void siFaltaStockNoSeGuardaNada() {
        Producto guitarra = producto("GA001", 129990, 1, 0);

        CompraDTO compra = new CompraDTO(List.of(new ItemCompraDTO("GA001", 2)), null, direccion);

        assertThatThrownBy(() -> boletaService.crearCompra("fsoto2000@gmail.com", compra))
                .isInstanceOf(ConflictoException.class)
                .hasMessageContaining("Stock insuficiente");
        verify(boletaRepository, never()).save(any());
        assertThat(guitarra.getStock()).isEqualTo(1);
    }

    @Test
    void aplicaElCuponYCobraDespacho() {
        producto("GA001", 100000, 5, 0);
        guardarDevuelveLaMisma();

        BoletaDTO boleta = boletaService.crearCompra("fsoto2000@gmail.com",
                new CompraDTO(List.of(new ItemCompraDTO("ga001", 1)), "sonidovivo10", direccion));

        assertThat(boleta.subtotal()).isEqualTo(100000);
        assertThat(boleta.descuento()).isEqualTo(10000);
        assertThat(boleta.despacho()).isEqualTo(4990);
        assertThat(boleta.total()).isEqualTo(94990);
        assertThat(boleta.cupon()).isEqualTo("SONIDOVIVO10");
    }

    @Test
    void elDespachoEsGratisSobre150000YDescuentaElStock() {
        Producto teclado = producto("TE001", 100000, 5, 0);
        guardarDevuelveLaMisma();

        BoletaDTO boleta = boletaService.crearCompra("fsoto2000@gmail.com",
                new CompraDTO(List.of(new ItemCompraDTO("TE001", 2)), null, direccion));

        assertThat(boleta.despacho()).isZero();
        assertThat(boleta.total()).isEqualTo(200000);
        assertThat(teclado.getStock()).isEqualTo(3);
        assertThat(boleta.estado()).isEqualTo("PAGADA");
    }

    @Test
    void usaElPrecioDeOfertaDelProducto() {
        producto("BA001", 249990, 3, 15);
        guardarDevuelveLaMisma();

        BoletaDTO boleta = boletaService.crearCompra("fsoto2000@gmail.com",
                new CompraDTO(List.of(new ItemCompraDTO("BA001", 1)), null, direccion));

        assertThat(boleta.detalles().get(0).precioUnitario()).isEqualTo(212490);
    }

    @Test
    void rechazaUnCuponQueNoExiste() {
        producto("GA001", 100000, 5, 0);

        assertThatThrownBy(() -> boletaService.crearCompra("fsoto2000@gmail.com",
                new CompraDTO(List.of(new ItemCompraDTO("GA001", 1)), "GRATIS100", direccion)))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void anularDevuelveElStock() {
        Producto guitarra = producto("GA001", 100000, 4, 0);
        guardarDevuelveLaMisma();
        BoletaDTO creada = boletaService.crearCompra("fsoto2000@gmail.com",
                new CompraDTO(List.of(new ItemCompraDTO("GA001", 3)), null, direccion));
        assertThat(guitarra.getStock()).isEqualTo(1);

        Boleta guardada = new Boleta();
        guardada.setNumero(1L);
        guardada.setEstado(EstadoBoleta.PAGADA);
        guardada.setUsuario(usuarioRepository.findByCorreoIgnoreCase("fsoto2000@gmail.com").get());
        DetalleBoleta detalle = new DetalleBoleta();
        detalle.setProducto(guitarra);
        detalle.setCantidad(creada.detalles().get(0).cantidad());
        detalle.setPrecioUnitario(100000);
        detalle.setSubtotal(300000);
        guardada.getDetalles().add(detalle);
        when(boletaRepository.findById(1L)).thenReturn(Optional.of(guardada));

        BoletaDTO anulada = boletaService.anular(1L);

        assertThat(anulada.estado()).isEqualTo("ANULADA");
        assertThat(guitarra.getStock()).isEqualTo(4);
    }
}
