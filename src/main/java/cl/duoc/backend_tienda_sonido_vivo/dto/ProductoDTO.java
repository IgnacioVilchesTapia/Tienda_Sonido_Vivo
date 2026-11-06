package cl.duoc.backend_tienda_sonido_vivo.dto;

import cl.duoc.backend_tienda_sonido_vivo.model.Producto;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ProductoDTO(
        @NotBlank(message = "El código es obligatorio")
        @Size(max = 10, message = "El código tiene máximo 10 caracteres")
        String codigo,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre tiene máximo 100 caracteres")
        String nombre,

        @Size(max = 60) String marca,
        @Size(max = 60) String modelo,
        @Size(max = 500) String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor a 0")
        Integer precio,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock,

        @Min(value = 0, message = "El stock crítico no puede ser negativo")
        Integer stockCritico,

        @Min(value = 0, message = "El descuento va de 0 a 90")
        @Max(value = 90, message = "El descuento va de 0 a 90")
        Integer descuento,

        @Size(max = 200) String imagen,
        String categoria,
        Long categoriaId
) {

    public static ProductoDTO desde(Producto p) {
        return new ProductoDTO(
                p.getCodigo(),
                p.getNombre(),
                p.getMarca(),
                p.getModelo(),
                p.getDescripcion(),
                p.getPrecio(),
                p.getStock(),
                p.getStockCritico(),
                p.getDescuento(),
                p.getImagen(),
                p.getCategoria().getNombre(),
                p.getCategoria().getId()
        );
    }
}
