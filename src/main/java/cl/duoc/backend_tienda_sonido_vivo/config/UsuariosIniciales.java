package cl.duoc.backend_tienda_sonido_vivo.config;

import cl.duoc.backend_tienda_sonido_vivo.model.Rol;
import cl.duoc.backend_tienda_sonido_vivo.model.Usuario;
import cl.duoc.backend_tienda_sonido_vivo.repository.UsuarioRepository;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UsuariosIniciales implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuariosIniciales(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        crearSiNoExiste("190110222", "Carla", "Pizarro Muñoz", "c.pizarro@duoc.cl", "admin123", Rol.ADMIN,
                "Región de Valparaíso", "Viña del Mar", "Av. San Martín 452", "1994-03-12");
        crearSiNoExiste("175558888", "Diego", "Rojas Fuentes", "d.rojas@duoc.cl", "vende123", Rol.VENDEDOR,
                "Región de Valparaíso", "Valparaíso", "Calle Prat 88", "1990-11-02");
        crearSiNoExiste("213334441", "Fernanda", "Soto Lagos", "fsoto2000@gmail.com", "cliente123", Rol.CLIENTE,
                "Región Metropolitana de Santiago", "Ñuñoa", "Irarrázaval 1200, depto 41", "2000-07-25");
        crearSiNoExiste("165552229", "Matías", "Contreras Vera", "m.contreras@profesor.duoc.cl", "vende123", Rol.VENDEDOR,
                "Región del Biobío", "Concepción", "Barros Arana 340", "1988-01-30");
    }

    private void crearSiNoExiste(String run, String nombre, String apellidos, String correo, String clave, Rol rol,
                                 String region, String comuna, String direccion, String nacimiento) {
        if (usuarioRepository.existsById(run)) {
            return;
        }
        Usuario usuario = new Usuario();
        usuario.setRun(run);
        usuario.setNombre(nombre);
        usuario.setApellidos(apellidos);
        usuario.setCorreo(correo);
        usuario.setPassword(passwordEncoder.encode(clave));
        usuario.setRol(rol);
        usuario.setRegion(region);
        usuario.setComuna(comuna);
        usuario.setDireccion(direccion);
        usuario.setFechaNacimiento(LocalDate.parse(nacimiento));
        usuarioRepository.save(usuario);
    }
}
