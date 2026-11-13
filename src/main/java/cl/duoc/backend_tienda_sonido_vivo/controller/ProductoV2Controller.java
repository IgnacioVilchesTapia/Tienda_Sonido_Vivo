package cl.duoc.backend_tienda_sonido_vivo.controller;

import cl.duoc.backend_tienda_sonido_vivo.dto.PaginaDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.ProductoDTO;
import cl.duoc.backend_tienda_sonido_vivo.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/productos")
@Tag(name = "Productos V2", description = "Catálogo versionado con paginación")
public class ProductoV2Controller {

    private final ProductoService productoService;

    public ProductoV2Controller(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    @Operation(summary = "Lista productos con paginación")
    public PaginaDTO<ProductoDTO> listar(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int limite,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String q) {
        return productoService.listarPaginado(pagina, limite, categoria, q);
    }
}
