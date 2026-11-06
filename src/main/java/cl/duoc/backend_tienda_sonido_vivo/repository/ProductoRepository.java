package cl.duoc.backend_tienda_sonido_vivo.repository;

import cl.duoc.backend_tienda_sonido_vivo.model.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductoRepository extends JpaRepository<Producto, String> {

    List<Producto> findByCategoriaNombreIgnoreCase(String nombre);

    List<Producto> findByDescuentoGreaterThan(Integer descuento);

    @Query("select p from Producto p where p.stock <= p.stockCritico")
    List<Producto> buscarStockCritico();

    boolean existsByCategoriaId(Long categoriaId);
}
