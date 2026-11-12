package cl.duoc.backend_tienda_sonido_vivo.dto;

import cl.duoc.backend_tienda_sonido_vivo.model.Boleta;
import java.time.LocalDateTime;
import java.util.List;

public record BoletaDTO(
        Long numero,
        LocalDateTime fecha,
        String estado,
        String clienteRun,
        String clienteNombre,
        String clienteCorreo,
        String cupon,
        Integer subtotal,
        Integer descuento,
        Integer despacho,
        Integer total,
        String calle,
        String depto,
        String region,
        String comuna,
        String indicaciones,
        List<DetalleBoletaDTO> detalles
) {

    public static BoletaDTO desde(Boleta b) {
        return new BoletaDTO(
                b.getNumero(),
                b.getFecha(),
                b.getEstado().name(),
                b.getUsuario().getRun(),
                b.getUsuario().getNombre() + " " + b.getUsuario().getApellidos(),
                b.getUsuario().getCorreo(),
                b.getCupon(),
                b.getSubtotal(),
                b.getDescuento(),
                b.getDespacho(),
                b.getTotal(),
                b.getCalle(),
                b.getDepto(),
                b.getRegion(),
                b.getComuna(),
                b.getIndicaciones(),
                b.getDetalles().stream().map(DetalleBoletaDTO::desde).toList()
        );
    }
}
