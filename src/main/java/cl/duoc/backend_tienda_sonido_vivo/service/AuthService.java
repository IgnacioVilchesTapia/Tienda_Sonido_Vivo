package cl.duoc.backend_tienda_sonido_vivo.service;

import cl.duoc.backend_tienda_sonido_vivo.dto.AuthRespuesta;
import cl.duoc.backend_tienda_sonido_vivo.dto.LoginDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.RefreshDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioFormDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.CredencialesInvalidasException;
import cl.duoc.backend_tienda_sonido_vivo.model.Usuario;
import cl.duoc.backend_tienda_sonido_vivo.repository.UsuarioRepository;
import cl.duoc.backend_tienda_sonido_vivo.security.JwtService;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, UsuarioService usuarioService,
                       JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public AuthRespuesta login(LoginDTO dto) {
        Optional<Usuario> encontrado = usuarioRepository.findByCorreoIgnoreCase(dto.correo().trim());
        if (encontrado.isEmpty() || !passwordEncoder.matches(dto.password(), encontrado.get().getPassword())) {
            throw new CredencialesInvalidasException("Correo o contraseña incorrectos");
        }
        return crearRespuesta(encontrado.get());
    }

    @Transactional
    public AuthRespuesta registro(UsuarioFormDTO dto) {
        Usuario nuevo = usuarioService.registrar(dto);
        return crearRespuesta(nuevo);
    }

    @Transactional(readOnly = true)
    public AuthRespuesta refresh(RefreshDTO dto) {
        if (!jwtService.esRefreshToken(dto.refreshToken())) {
            throw new CredencialesInvalidasException("El refresh token no es válido o ya venció");
        }
        String correo = jwtService.obtenerCorreo(dto.refreshToken());
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new CredencialesInvalidasException("El usuario del token ya no existe"));
        return crearRespuesta(usuario);
    }

    private AuthRespuesta crearRespuesta(Usuario usuario) {
        String token = jwtService.generarToken(usuario);
        String refreshToken = jwtService.generarRefreshToken(usuario);
        return new AuthRespuesta(token, refreshToken, UsuarioDTO.desde(usuario));
    }
}
