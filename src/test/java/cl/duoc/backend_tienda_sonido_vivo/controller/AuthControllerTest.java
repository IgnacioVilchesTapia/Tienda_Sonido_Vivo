package cl.duoc.backend_tienda_sonido_vivo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.duoc.backend_tienda_sonido_vivo.config.CorsConfig;
import cl.duoc.backend_tienda_sonido_vivo.dto.AuthRespuesta;
import cl.duoc.backend_tienda_sonido_vivo.dto.LoginDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.UsuarioDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.CredencialesInvalidasException;
import cl.duoc.backend_tienda_sonido_vivo.model.Rol;
import cl.duoc.backend_tienda_sonido_vivo.model.Usuario;
import cl.duoc.backend_tienda_sonido_vivo.security.JwtService;
import cl.duoc.backend_tienda_sonido_vivo.security.SecurityConfig;
import cl.duoc.backend_tienda_sonido_vivo.security.UsuarioDetailsService;
import cl.duoc.backend_tienda_sonido_vivo.service.AuthService;
import cl.duoc.backend_tienda_sonido_vivo.service.UsuarioService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest({AuthController.class, UsuarioController.class})
@Import({SecurityConfig.class, CorsConfig.class, JwtService.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private UsuarioDetailsService usuarioDetailsService;

    private final UsuarioDTO carla = new UsuarioDTO("190110222", "Carla", "Pizarro Muñoz", "c.pizarro@duoc.cl",
            "ADMIN", "Región de Valparaíso", "Viña del Mar", "Av. San Martín 452", null);

    private String tokenDe(String correo, Rol rol) {
        Usuario usuario = new Usuario();
        usuario.setCorreo(correo);
        usuario.setRol(rol);
        when(usuarioDetailsService.loadUserByUsername(correo))
                .thenReturn(User.withUsername(correo).password("x").roles(rol.name()).build());
        return jwtService.generarToken(usuario);
    }

    @Test
    void loginCorrectoDevuelveElToken() throws Exception {
        when(authService.login(any(LoginDTO.class))).thenReturn(new AuthRespuesta("token-de-prueba", "refresh-de-prueba", carla));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"c.pizarro@duoc.cl\",\"password\":\"admin123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token-de-prueba"))
                .andExpect(jsonPath("$.usuario.rol").value("ADMIN"));
    }

    @Test
    void claveMalaDevuelve401() throws Exception {
        when(authService.login(any(LoginDTO.class)))
                .thenThrow(new CredencialesInvalidasException("Correo o contraseña incorrectos"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"c.pizarro@duoc.cl\",\"password\":\"mala\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Correo o contraseña incorrectos"));
    }

    @Test
    void sinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void elRefreshTokenNoSirveParaEntrar() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setCorreo("c.pizarro@duoc.cl");
        usuario.setRol(Rol.ADMIN);
        String refresh = jwtService.generarRefreshToken(usuario);

        mockMvc.perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + refresh))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void conTokenDevuelveSusDatos() throws Exception {
        String token = tokenDe("c.pizarro@duoc.cl", Rol.ADMIN);
        when(usuarioService.obtenerPorCorreo("c.pizarro@duoc.cl")).thenReturn(carla);

        mockMvc.perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("c.pizarro@duoc.cl"));
    }

    @Test
    void clienteEnRutaDeAdminDevuelve403() throws Exception {
        String token = tokenDe("fsoto2000@gmail.com", Rol.CLIENTE);

        mockMvc.perform(get("/api/v1/usuarios").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    void adminPuedeListarUsuarios() throws Exception {
        String token = tokenDe("c.pizarro@duoc.cl", Rol.ADMIN);
        when(usuarioService.listar()).thenReturn(List.of(carla));

        mockMvc.perform(get("/api/v1/usuarios").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].run").value("190110222"));
    }
}
