package cl.duoc.backend_tienda_sonido_vivo.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.duoc.backend_tienda_sonido_vivo.dto.CategoriaDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.ConflictoException;
import cl.duoc.backend_tienda_sonido_vivo.model.Categoria;
import cl.duoc.backend_tienda_sonido_vivo.repository.CategoriaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.ProductoRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    @Test
    void noSePuedeEliminarUnaCategoriaConProductos() {
        Categoria bajos = new Categoria("Bajos Eléctricos");
        bajos.setId(3L);
        when(categoriaRepository.findById(3L)).thenReturn(Optional.of(bajos));
        when(productoRepository.existsByCategoriaId(3L)).thenReturn(true);

        assertThatThrownBy(() -> categoriaService.eliminar(3L)).isInstanceOf(ConflictoException.class);
        verify(categoriaRepository, never()).deleteById(any());
    }

    @Test
    void noSePuedeCrearUnaCategoriaRepetida() {
        when(categoriaRepository.existsByNombreIgnoreCase("Baterías")).thenReturn(true);

        assertThatThrownBy(() -> categoriaService.crear(new CategoriaDTO(null, " Baterías ")))
                .isInstanceOf(ConflictoException.class);
    }
}
