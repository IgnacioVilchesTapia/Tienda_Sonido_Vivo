package cl.duoc.backend_tienda_sonido_vivo.repository;

import cl.duoc.backend_tienda_sonido_vivo.model.Boleta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoletaRepository extends JpaRepository<Boleta, Long> {

    List<Boleta> findAllByOrderByFechaDesc();

    List<Boleta> findByUsuarioCorreoIgnoreCaseOrderByFechaDesc(String correo);
}
