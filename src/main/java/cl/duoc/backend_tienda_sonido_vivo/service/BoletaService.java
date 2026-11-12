package cl.duoc.backend_tienda_sonido_vivo.service;

import cl.duoc.backend_tienda_sonido_vivo.dto.BoletaDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.CompraDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.ItemCompraDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.ConflictoException;
import cl.duoc.backend_tienda_sonido_vivo.exception.RecursoNoEncontradoException;
import cl.duoc.backend_tienda_sonido_vivo.model.Boleta;
import cl.duoc.backend_tienda_sonido_vivo.model.DetalleBoleta;
import cl.duoc.backend_tienda_sonido_vivo.model.EstadoBoleta;
import cl.duoc.backend_tienda_sonido_vivo.model.Producto;
import cl.duoc.backend_tienda_sonido_vivo.model.Usuario;
import cl.duoc.backend_tienda_sonido_vivo.repository.BoletaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.ProductoRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BoletaService {

    private static final Map<String, Integer> CUPONES = Map.of("SONIDOVIVO10", 10, "MUSICO5", 5);
    private static final int COSTO_DESPACHO = 4990;
    private static final int DESPACHO_GRATIS_SOBRE = 150000;

    private final BoletaRepository boletaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public BoletaService(BoletaRepository boletaRepository, ProductoRepository productoRepository,
                         UsuarioRepository usuarioRepository) {
        this.boletaRepository = boletaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public BoletaDTO crearCompra(String correoCliente, CompraDTO compra) {
        Usuario cliente = usuarioRepository.findByCorreoIgnoreCase(correoCliente)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + correoCliente));

        Boleta boleta = new Boleta();
        boleta.setUsuario(cliente);
        boleta.setFecha(LocalDateTime.now());
        boleta.setEstado(EstadoBoleta.PAGADA);

        int subtotal = 0;
        for (ItemCompraDTO item : compra.items()) {
            String codigo = item.codigo().trim().toUpperCase(Locale.ROOT);
            Producto producto = productoRepository.findById(codigo)
                    .orElseThrow(() -> new RecursoNoEncontradoException("No existe el producto " + codigo));
            if (producto.getStock() < item.cantidad()) {
                throw new ConflictoException("Stock insuficiente para " + codigo + ": quedan " + producto.getStock());
            }

            int precio = precioFinal(producto);
            DetalleBoleta detalle = new DetalleBoleta();
            detalle.setBoleta(boleta);
            detalle.setProducto(producto);
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitario(precio);
            detalle.setSubtotal(precio * item.cantidad());
            boleta.getDetalles().add(detalle);

            producto.setStock(producto.getStock() - item.cantidad());
            subtotal += detalle.getSubtotal();
        }

        String cupon = limpiarCupon(compra.cupon());
        int porcentaje = 0;
        if (cupon != null) {
            if (!CUPONES.containsKey(cupon)) {
                throw new IllegalArgumentException("El cupón " + cupon + " no es válido");
            }
            porcentaje = CUPONES.get(cupon);
        }
        int descuento = (int) Math.round(subtotal * porcentaje / 100.0);
        int despacho = subtotal > DESPACHO_GRATIS_SOBRE ? 0 : COSTO_DESPACHO;

        boleta.setCupon(cupon);
        boleta.setSubtotal(subtotal);
        boleta.setDescuento(descuento);
        boleta.setDespacho(despacho);
        boleta.setTotal(subtotal - descuento + despacho);
        boleta.setCalle(compra.direccion().calle());
        boleta.setDepto(compra.direccion().depto());
        boleta.setRegion(compra.direccion().region());
        boleta.setComuna(compra.direccion().comuna());
        boleta.setIndicaciones(compra.direccion().indicaciones());

        return BoletaDTO.desde(boletaRepository.save(boleta));
    }

    @Transactional(readOnly = true)
    public List<BoletaDTO> listar() {
        return boletaRepository.findAllByOrderByFechaDesc().stream().map(BoletaDTO::desde).toList();
    }

    @Transactional(readOnly = true)
    public List<BoletaDTO> misCompras(String correoCliente) {
        return boletaRepository.findByUsuarioCorreoIgnoreCaseOrderByFechaDesc(correoCliente).stream()
                .map(BoletaDTO::desde).toList();
    }

    @Transactional(readOnly = true)
    public BoletaDTO obtener(Long numero) {
        return BoletaDTO.desde(buscar(numero));
    }

    @Transactional
    public BoletaDTO cambiarEstado(Long numero, String nuevoEstado) {
        Boleta boleta = buscar(numero);
        EstadoBoleta estado = convertirEstado(nuevoEstado);
        if (estado == EstadoBoleta.ANULADA) {
            return anular(numero);
        }
        if (boleta.getEstado() == EstadoBoleta.ANULADA) {
            throw new ConflictoException("La boleta " + numero + " está anulada y no se puede cambiar");
        }
        boleta.setEstado(estado);
        return BoletaDTO.desde(boletaRepository.save(boleta));
    }

    @Transactional
    public BoletaDTO anular(Long numero) {
        Boleta boleta = buscar(numero);
        if (boleta.getEstado() == EstadoBoleta.ANULADA) {
            throw new ConflictoException("La boleta " + numero + " ya está anulada");
        }
        for (DetalleBoleta detalle : boleta.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
        }
        boleta.setEstado(EstadoBoleta.ANULADA);
        return BoletaDTO.desde(boletaRepository.save(boleta));
    }

    private Boleta buscar(Long numero) {
        return boletaRepository.findById(numero)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la boleta " + numero));
    }

    private int precioFinal(Producto producto) {
        if (producto.getDescuento() == null || producto.getDescuento() == 0) {
            return producto.getPrecio();
        }
        double conDescuento = producto.getPrecio() - producto.getPrecio() * producto.getDescuento() / 100.0;
        return (int) Math.round(conDescuento / 10) * 10;
    }

    private String limpiarCupon(String cupon) {
        if (cupon == null || cupon.isBlank()) {
            return null;
        }
        return cupon.trim().toUpperCase(Locale.ROOT);
    }

    private EstadoBoleta convertirEstado(String texto) {
        try {
            return EstadoBoleta.valueOf(texto.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("El estado debe ser PAGADA, ENVIADA, ENTREGADA o ANULADA");
        }
    }
}
