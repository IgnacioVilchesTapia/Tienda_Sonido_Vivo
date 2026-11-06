package cl.duoc.backend_tienda_sonido_vivo.controller;

import cl.duoc.backend_tienda_sonido_vivo.dto.CategoriaDTO;
import cl.duoc.backend_tienda_sonido_vivo.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/categorias")
@Tag(name = "Categorías", description = "Categorías del catálogo (CRUD)")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    @Operation(summary = "Lista las categorías")
    public List<CategoriaDTO> listar() {
        return categoriaService.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtiene una categoría")
    public CategoriaDTO obtener(@PathVariable Long id) {
        return categoriaService.obtener(id);
    }

    @PostMapping
    @Operation(summary = "Crea una categoría")
    public ResponseEntity<CategoriaDTO> crear(@Valid @RequestBody CategoriaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crear(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cambia el nombre de una categoría")
    public CategoriaDTO actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaDTO dto) {
        return categoriaService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina una categoría", description = "Responde 409 si la categoría todavía tiene productos")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
