package cl.duoc.backend_tienda_sonido_vivo.controller;

import cl.duoc.backend_tienda_sonido_vivo.dto.AuthRespuesta;
import cl.duoc.backend_tienda_sonido_vivo.dto.LoginDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.RefreshDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioFormDTO;
import cl.duoc.backend_tienda_sonido_vivo.service.AuthService;
import cl.duoc.backend_tienda_sonido_vivo.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación", description = "Login, registro y renovación del token JWT")
public class AuthController {

    private final AuthService authService;
    private final UsuarioService usuarioService;

    public AuthController(AuthService authService, UsuarioService usuarioService) {
        this.authService = authService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    @Operation(summary = "Inicia sesión", description = "Devuelve el token de acceso (30 min) y el refresh token (7 días)")
    public AuthRespuesta login(@Valid @RequestBody LoginDTO dto) {
        return authService.login(dto);
    }

    @PostMapping("/registro")
    @Operation(summary = "Registra un cliente nuevo y deja la sesión iniciada")
    public ResponseEntity<AuthRespuesta> registro(@Valid @RequestBody UsuarioFormDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registro(dto));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Entrega un token nuevo usando el refresh token")
    public AuthRespuesta refresh(@Valid @RequestBody RefreshDTO dto) {
        return authService.refresh(dto);
    }

    @GetMapping("/me")
    @Operation(summary = "Devuelve los datos del usuario del token")
    public UsuarioDTO me(@Parameter(hidden = true) Authentication authentication) {
        return usuarioService.obtenerPorCorreo(authentication.getName());
    }
}
