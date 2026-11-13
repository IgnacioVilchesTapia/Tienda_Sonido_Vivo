package cl.duoc.backend_tienda_sonido_vivo.service;

import cl.duoc.backend_tienda_sonido_vivo.dto.PaginaDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.ProductoDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.ConflictoException;
import cl.duoc.backend_tienda_sonido_vivo.exception.RecursoNoEncontradoException;
import cl.duoc.backend_tienda_sonido_vivo.model.Categoria;
import cl.duoc.backend_tienda_sonido_vivo.model.Producto;
import cl.duoc.backend_tienda_sonido_vivo.repository.CategoriaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.ProductoRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> listar(String categoria, String q) {
        List<Producto> productos = tieneTexto(categoria)
                ? productoRepository.findByCategoriaNombreIgnoreCase(categoria.trim())
                : productoRepository.findAll();

        if (tieneTexto(q)) {
            String texto = q.trim().toLowerCase(Locale.ROOT);
            productos = productos.stream().filter(p -> coincide(p, texto)).toList();
        }
        return productos.stream().map(ProductoDTO::desde).toList();
    }

    @Transactional(readOnly = true)
    public PaginaDTO<ProductoDTO> listarPaginado(int pagina, int limite, String categoria, String q) {
        if (pagina < 0) pagina = 0;
        if (limite <= 0) limite = 10;
        List<ProductoDTO> todos = listar(categoria, q);
        int totalElementos = todos.size();
        int totalPaginas = (int) Math.ceil((double) totalElementos / limite);
        int desde = Math.min(pagina * limite, totalElementos);
        int hasta = Math.min(desde + limite, totalElementos);
        List<ProductoDTO> contenido = todos.subList(desde, hasta);
        return new PaginaDTO<>(contenido, pagina, totalPaginas, (long) totalElementos);
    }

    @Transactional(readOnly = true)
    public ProductoDTO obtener(String codigo) {
        return ProductoDTO.desde(buscar(codigo));
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> ofertas() {
        return productoRepository.findByDescuentoGreaterThan(0).stream().map(ProductoDTO::desde).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> criticos() {
        return productoRepository.buscarStockCritico().stream().map(ProductoDTO::desde).toList();
    }

    @Transactional
    public ProductoDTO crear(ProductoDTO dto) {
        String codigo = normalizarCodigo(dto.codigo());
        if (productoRepository.existsById(codigo)) {
            throw new ConflictoException("Ya existe un producto con el código " + codigo);
        }
        Producto producto = new Producto();
        producto.setCodigo(codigo);
        copiarDatos(dto, producto);
        return ProductoDTO.desde(productoRepository.save(producto));
    }

    @Transactional
    public ProductoDTO actualizar(String codigo, ProductoDTO dto) {
        Producto producto = buscar(codigo);
        copiarDatos(dto, producto);
        return ProductoDTO.desde(productoRepository.save(producto));
    }

    @Transactional
    public void eliminar(String codigo) {
        Producto producto = buscar(codigo);
        productoRepository.delete(producto);
    }

    private Producto buscar(String codigo) {
        String limpio = normalizarCodigo(codigo);
        return productoRepository.findById(limpio)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el producto " + limpio));
    }

    private void copiarDatos(ProductoDTO dto, Producto producto) {
        producto.setNombre(dto.nombre().trim());
        producto.setMarca(dto.marca());
        producto.setModelo(dto.modelo());
        producto.setDescripcion(dto.descripcion());
        producto.setPrecio(dto.precio());
        producto.setStock(dto.stock());
        producto.setStockCritico(dto.stockCritico() != null ? dto.stockCritico() : 3);
        producto.setDescuento(dto.descuento() != null ? dto.descuento() : 0);
        producto.setImagen(dto.imagen());
        producto.setCategoria(resolverCategoria(dto));
    }

    private Categoria resolverCategoria(ProductoDTO dto) {
        if (dto.categoriaId() != null) {
            return categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("No existe la categoría " + dto.categoriaId()));
        }
        if (tieneTexto(dto.categoria())) {
            return categoriaRepository.findByNombreIgnoreCase(dto.categoria().trim())
                    .orElseThrow(() -> new RecursoNoEncontradoException("No existe la categoría " + dto.categoria()));
        }
        throw new IllegalArgumentException("Debe indicar categoriaId o categoria");
    }

    private static boolean coincide(Producto p, String texto) {
        return contiene(p.getNombre(), texto) || contiene(p.getMarca(), texto)
                || contiene(p.getModelo(), texto) || contiene(p.getCodigo(), texto);
    }

    private static boolean contiene(String valor, String texto) {
        return valor != null && valor.toLowerCase(Locale.ROOT).contains(texto);
    }

    private static boolean tieneTexto(String valor) {
        return valor != null && !valor.isBlank();
    }

    private static String normalizarCodigo(String codigo) {
        return codigo.trim().toUpperCase(Locale.ROOT);
    }
}
