package cl.duoc.backend_tienda_sonido_vivo.controller;

import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioFormDTO;
import cl.duoc.backend_tienda_sonido_vivo.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuarios", description = "Administración de usuarios (solo ADMIN, salvo el perfil propio)")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lista los usuarios")
    public List<UsuarioDTO> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{run}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtiene un usuario por su RUN")
    public UsuarioDTO obtener(@PathVariable String run) {
        return usuarioService.obtener(run);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crea un usuario con cualquier rol")
    public ResponseEntity<UsuarioDTO> crear(@Valid @RequestBody UsuarioFormDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(dto));
    }

    @PutMapping("/me")
    @Operation(summary = "Actualiza el perfil del usuario del token", description = "No cambia el rol ni el RUN")
    public UsuarioDTO actualizarPerfil(@Parameter(hidden = true) Authentication authentication,
                                       @Valid @RequestBody UsuarioFormDTO dto) {
        return usuarioService.actualizarPerfil(authentication.getName(), dto);
    }

    @PutMapping("/{run}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualiza un usuario", description = "Si la contraseña viene vacía se mantiene la anterior")
    public UsuarioDTO actualizar(@PathVariable String run, @Valid @RequestBody UsuarioFormDTO dto) {
        return usuarioService.actualizar(run, dto);
    }

    @DeleteMapping("/{run}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Elimina un usuario", description = "Un administrador no puede eliminarse a sí mismo")
    public ResponseEntity<Void> eliminar(@PathVariable String run,
                                         @Parameter(hidden = true) Authentication authentication) {
        usuarioService.eliminar(run, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
