package cl.duoc.backend_tienda_sonido_vivo.controller;

import cl.duoc.backend_tienda_sonido_vivo.dto.ProductoDTO;
import cl.duoc.backend_tienda_sonido_vivo.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/productos")
@Tag(name = "Productos", description = "Catálogo de instrumentos (CRUD)")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    @Operation(summary = "Lista los productos", description = "Filtros opcionales por categoría y por texto")
    public List<ProductoDTO> listar(
            @Parameter(description = "Nombre de la categoría, ej: Guitarras Eléctricas")
            @RequestParam(required = false) String categoria,
            @Parameter(description = "Texto a buscar en nombre, marca, modelo o código")
            @RequestParam(required = false) String q) {
        return productoService.listar(categoria, q);
    }

    @GetMapping("/ofertas")
    @Operation(summary = "Lista los productos con descuento")
    public List<ProductoDTO> ofertas() {
        return productoService.ofertas();
    }

    @GetMapping("/criticos")
    @Operation(summary = "Lista los productos con stock crítico", description = "Stock menor o igual al stock crítico")
    public List<ProductoDTO> criticos() {
        return productoService.criticos();
    }

    @GetMapping("/{codigo}")
    @Operation(summary = "Obtiene el detalle de un producto")
    public ProductoDTO obtener(@PathVariable String codigo) {
        return productoService.obtener(codigo);
    }

    @PostMapping
    @Operation(summary = "Crea un producto")
    public ResponseEntity<ProductoDTO> crear(@Valid @RequestBody ProductoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(dto));
    }

    @PutMapping("/{codigo}")
    @Operation(summary = "Actualiza un producto", description = "El código de la ruta manda; el del cuerpo no se cambia")
    public ProductoDTO actualizar(@PathVariable String codigo, @Valid @RequestBody ProductoDTO dto) {
        return productoService.actualizar(codigo, dto);
    }

    @DeleteMapping("/{codigo}")
    @Operation(summary = "Elimina un producto")
    public ResponseEntity<Void> eliminar(@PathVariable String codigo) {
        productoService.eliminar(codigo);
        return ResponseEntity.noContent().build();
    }
}
