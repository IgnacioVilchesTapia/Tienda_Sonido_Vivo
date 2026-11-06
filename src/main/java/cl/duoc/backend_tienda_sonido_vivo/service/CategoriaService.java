package cl.duoc.backend_tienda_sonido_vivo.service;

import cl.duoc.backend_tienda_sonido_vivo.dto.CategoriaDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.ConflictoException;
import cl.duoc.backend_tienda_sonido_vivo.exception.RecursoNoEncontradoException;
import cl.duoc.backend_tienda_sonido_vivo.model.Categoria;
import cl.duoc.backend_tienda_sonido_vivo.repository.CategoriaRepository;
import cl.duoc.backend_tienda_sonido_vivo.repository.ProductoRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listar() {
        return categoriaRepository.findAll().stream().map(CategoriaDTO::desde).toList();
    }

    @Transactional(readOnly = true)
    public CategoriaDTO obtener(Long id) {
        return CategoriaDTO.desde(buscar(id));
    }

    @Transactional
    public CategoriaDTO crear(CategoriaDTO dto) {
        String nombre = dto.nombre().trim();
        if (categoriaRepository.existsByNombreIgnoreCase(nombre)) {
            throw new ConflictoException("Ya existe la categoría " + nombre);
        }
        return CategoriaDTO.desde(categoriaRepository.save(new Categoria(nombre)));
    }

    @Transactional
    public CategoriaDTO actualizar(Long id, CategoriaDTO dto) {
        Categoria categoria = buscar(id);
        String nombre = dto.nombre().trim();
        Optional<Categoria> existente = categoriaRepository.findByNombreIgnoreCase(nombre);
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new ConflictoException("Ya existe la categoría " + nombre);
        }
        categoria.setNombre(nombre);
        return CategoriaDTO.desde(categoriaRepository.save(categoria));
    }

    @Transactional
    public void eliminar(Long id) {
        buscar(id);
        if (productoRepository.existsByCategoriaId(id)) {
            throw new ConflictoException("No se puede eliminar: la categoría tiene productos");
        }
        categoriaRepository.deleteById(id);
    }

    private Categoria buscar(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la categoría " + id));
    }
}
