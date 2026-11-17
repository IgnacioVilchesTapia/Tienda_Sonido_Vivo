package cl.duoc.backend_tienda_sonido_vivo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioFormDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.ConflictoException;
import cl.duoc.backend_tienda_sonido_vivo.model.Rol;
import cl.duoc.backend_tienda_sonido_vivo.model.Usuario;
import cl.duoc.backend_tienda_sonido_vivo.repository.UsuarioRepository;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private UsuarioFormDTO formulario(String run, String correo, String password, String rol) {
        return new UsuarioFormDTO(run, "Ana", "Pérez Soto", correo, password, rol,
                "Región de Valparaíso", "Viña del Mar", "Av. Libertad 100", LocalDate.of(2001, 5, 10));
    }

    @Test
    void registrarCreaUnClienteConLaClaveEncriptada() {
        when(passwordEncoder.encode("clave123")).thenReturn("clave-encriptada");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocacion -> invocacion.getArgument(0));

        Usuario creado = usuarioService.registrar(formulario("12.345.678-5", "Ana@Gmail.com", "clave123", "ADMIN"));

        assertThat(creado.getRol()).isEqualTo(Rol.CLIENTE);
        assertThat(creado.getPassword()).isEqualTo("clave-encriptada");
        assertThat(creado.getRun()).isEqualTo("123456785");
        assertThat(creado.getCorreo()).isEqualTo("ana@gmail.com");
    }

    @Test
    void noSePuedeRegistrarUnCorreoRepetido() {
        when(usuarioRepository.existsByCorreoIgnoreCase("ana@gmail.com")).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.registrar(formulario("12345678-5", "ana@gmail.com", "clave123", null)))
                .isInstanceOf(ConflictoException.class);
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void rechazaUnRunConDigitoVerificadorMalo() {
        assertThatThrownBy(() -> usuarioService.registrar(formulario("12345678-9", "ana@gmail.com", "clave123", null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("RUN");
    }

    @Test
    void rechazaCorreosDeOtrosDominios() {
        assertThatThrownBy(() -> usuarioService.registrar(formulario("12345678-5", "ana@hotmail.com", "clave123", null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("@gmail.com");
    }

    @Test
    void elAdminPuedeCrearUnVendedor() {
        when(passwordEncoder.encode("vende123")).thenReturn("clave-encriptada");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocacion -> invocacion.getArgument(0));

        assertThat(usuarioService.crear(formulario("20456789-1", "vendedor@duoc.cl", "vende123", "vendedor")).rol())
                .isEqualTo("VENDEDOR");
    }

    @Test
    void unAdminNoSePuedeEliminarASiMismo() {
        Usuario admin = new Usuario();
        admin.setRun("190110222");
        admin.setCorreo("c.pizarro@duoc.cl");
        admin.setRol(Rol.ADMIN);
        when(usuarioRepository.findById("190110222")).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> usuarioService.eliminar("19.011.022-2", "c.pizarro@duoc.cl"))
                .isInstanceOf(ConflictoException.class);
        verify(usuarioRepository, never()).delete(any());
    }

    @Test
    void registrarSinRunLanzaErrorDeDatos() {
        assertThatThrownBy(() -> usuarioService.registrar(formulario(null, "ana@gmail.com", "clave123", null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("El RUN es obligatorio");
    }

    @Test
    void passwordFueraDeRangoLanzaErrorDeDatos() {
        assertThatThrownBy(() -> usuarioService.registrar(formulario("12345678-5", "ana@gmail.com", "123", null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("La contraseña debe tener entre 4 y 10 caracteres");

        assertThatThrownBy(() -> usuarioService.registrar(formulario("12345678-5", "ana@gmail.com", "12345678901", null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("La contraseña debe tener entre 4 y 10 caracteres");
    }

    @Test
    void actualizarPerfilConPasswordVaciaMantieneLaAnteriorYNoBorraCamposNulos() {
        Usuario usuario = new Usuario();
        usuario.setRun("123456785");
        usuario.setCorreo("ana@gmail.com");
        usuario.setRol(Rol.CLIENTE);
        usuario.setPassword("clave-antigua");
        usuario.setRegion("Valparaíso");
        usuario.setComuna("Viña del Mar");
        usuario.setDireccion("Calle 1");
        usuario.setFechaNacimiento(LocalDate.of(2000, 1, 1));
        when(usuarioRepository.findByCorreoIgnoreCase("ana@gmail.com")).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        UsuarioFormDTO dto = new UsuarioFormDTO(null, "Ana Actualizada", "Pérez", "ana@gmail.com",
                "", null, null, null, null, null);

        var resultado = usuarioService.actualizarPerfil("ana@gmail.com", dto);

        assertThat(usuario.getPassword()).isEqualTo("clave-antigua");
        assertThat(resultado.nombre()).isEqualTo("Ana Actualizada");
        assertThat(resultado.region()).isEqualTo("Valparaíso");
        assertThat(resultado.comuna()).isEqualTo("Viña del Mar");
        assertThat(resultado.direccion()).isEqualTo("Calle 1");
        assertThat(usuario.getFechaNacimiento()).isEqualTo(LocalDate.of(2000, 1, 1));
    }
}
