package cl.duoc.backend_tienda_sonido_vivo.controller;

import cl.duoc.backend_tienda_sonido_vivo.repository.ProductoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/estado")
@Tag(name = "Estado", description = "Salud del backend")
public class EstadoController {

    private final ProductoRepository productoRepository;

    public EstadoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    @Operation(summary = "Indica si el backend y la base de datos responden")
    public Map<String, Object> estado() {
        return Map.of(
                "estado", "ok",
                "productosEnBaseDeDatos", productoRepository.count(),
                "hora", LocalDateTime.now().toString()
        );
    }
}
