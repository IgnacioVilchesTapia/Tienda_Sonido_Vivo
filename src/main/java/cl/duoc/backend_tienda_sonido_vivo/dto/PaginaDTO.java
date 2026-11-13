package cl.duoc.backend_tienda_sonido_vivo.dto;

import java.util.List;

public record PaginaDTO<T>(List<T> contenido, int pagina, int totalPaginas, long totalElementos) {
}
