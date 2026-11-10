package cl.duoc.backend_tienda_sonido_vivo.service;

import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioFormDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.ConflictoException;
import cl.duoc.backend_tienda_sonido_vivo.exception.RecursoNoEncontradoException;
import cl.duoc.backend_tienda_sonido_vivo.model.Rol;
import cl.duoc.backend_tienda_sonido_vivo.model.Usuario;
import cl.duoc.backend_tienda_sonido_vivo.repository.UsuarioRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private static final List<String> DOMINIOS_PERMITIDOS = List.of("@duoc.cl", "@profesor.duoc.cl", "@gmail.com");

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listar() {
        return usuarioRepository.findAll().stream().map(UsuarioDTO::desde).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioDTO obtener(String run) {
        return UsuarioDTO.desde(buscar(run));
    }

    @Transactional(readOnly = true)
    public UsuarioDTO obtenerPorCorreo(String correo) {
        return UsuarioDTO.desde(buscarPorCorreo(correo));
    }

    @Transactional
    public UsuarioDTO crear(UsuarioFormDTO dto) {
        Rol rol = Rol.CLIENTE;
        if (dto.rol() != null && !dto.rol().isBlank()) {
            rol = convertirRol(dto.rol());
        }
        return UsuarioDTO.desde(guardarNuevo(dto, rol));
    }

    @Transactional
    public Usuario registrar(UsuarioFormDTO dto) {
        return guardarNuevo(dto, Rol.CLIENTE);
    }

    @Transactional
    public UsuarioDTO actualizar(String run, UsuarioFormDTO dto) {
        Usuario usuario = buscar(run);
        copiarDatos(dto, usuario);
        if (dto.rol() != null && !dto.rol().isBlank()) {
            usuario.setRol(convertirRol(dto.rol()));
        }
        return UsuarioDTO.desde(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioDTO actualizarPerfil(String correo, UsuarioFormDTO dto) {
        Usuario usuario = buscarPorCorreo(correo);
        if (!usuario.getCorreo().equalsIgnoreCase(dto.correo().trim())) {
            throw new IllegalArgumentException("El correo no se puede cambiar desde el perfil");
        }
        copiarDatos(dto, usuario);
        return UsuarioDTO.desde(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminar(String run, String correoDelAdmin) {
        Usuario usuario = buscar(run);
        if (usuario.getCorreo().equalsIgnoreCase(correoDelAdmin)) {
            throw new ConflictoException("No puede eliminar su propia cuenta");
        }
        usuarioRepository.delete(usuario);
    }

    public Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreoIgnoreCase(correo.trim())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe un usuario con el correo " + correo));
    }

    private Usuario buscar(String run) {
        String limpio = limpiarRun(run);
        return usuarioRepository.findById(limpio)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario con RUN " + limpio));
    }

    private Usuario guardarNuevo(UsuarioFormDTO dto, Rol rol) {
        String run = limpiarRun(dto.run());
        if (!esRunValido(run)) {
            throw new IllegalArgumentException("El RUN " + run + " no es válido");
        }
        if (usuarioRepository.existsById(run)) {
            throw new ConflictoException("Ya existe un usuario con el RUN " + run);
        }
        if (dto.password() == null || dto.password().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        Usuario usuario = new Usuario();
        usuario.setRun(run);
        usuario.setRol(rol);
        copiarDatos(dto, usuario);
        return usuarioRepository.save(usuario);
    }

    private void copiarDatos(UsuarioFormDTO dto, Usuario usuario) {
        String correo = dto.correo().trim().toLowerCase(Locale.ROOT);
        if (!tieneDominioPermitido(correo)) {
            throw new IllegalArgumentException("Solo se aceptan correos @duoc.cl, @profesor.duoc.cl y @gmail.com");
        }
        if (!correo.equalsIgnoreCase(usuario.getCorreo()) && usuarioRepository.existsByCorreoIgnoreCase(correo)) {
            throw new ConflictoException("Ya existe un usuario con el correo " + correo);
        }
        usuario.setCorreo(correo);
        usuario.setNombre(dto.nombre().trim());
        usuario.setApellidos(dto.apellidos().trim());
        usuario.setRegion(dto.region());
        usuario.setComuna(dto.comuna());
        usuario.setDireccion(dto.direccion());
        usuario.setFechaNacimiento(dto.nacimiento());
        if (dto.password() != null && !dto.password().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(dto.password()));
        }
    }

    private Rol convertirRol(String texto) {
        try {
            return Rol.valueOf(texto.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("El rol debe ser ADMIN, VENDEDOR o CLIENTE");
        }
    }

    private boolean tieneDominioPermitido(String correo) {
        for (String dominio : DOMINIOS_PERMITIDOS) {
            if (correo.endsWith(dominio)) {
                return true;
            }
        }
        return false;
    }

    private String limpiarRun(String run) {
        return run.replace(".", "").replace("-", "").replace(" ", "").toUpperCase(Locale.ROOT);
    }

    private boolean esRunValido(String run) {
        if (run.length() < 7 || run.length() > 9) {
            return false;
        }
        String cuerpo = run.substring(0, run.length() - 1);
        char dvIngresado = run.charAt(run.length() - 1);
        if (!cuerpo.matches("\\d+")) {
            return false;
        }
        int suma = 0;
        int multiplicador = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += (cuerpo.charAt(i) - '0') * multiplicador;
            multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
        }
        int resto = 11 - (suma % 11);
        char dvEsperado;
        if (resto == 11) {
            dvEsperado = '0';
        } else if (resto == 10) {
            dvEsperado = 'K';
        } else {
            dvEsperado = (char) ('0' + resto);
        }
        return dvIngresado == dvEsperado;
    }
}
