package cl.duoc.backend_tienda_sonido_vivo.controller;

import cl.duoc.backend_tienda_sonido_vivo.dto.BoletaDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.CompraDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.EstadoDTO;
import cl.duoc.backend_tienda_sonido_vivo.service.BoletaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/boletas")
@Tag(name = "Boletas", description = "Compras de los clientes y su gestión")
public class BoletaController {

    private final BoletaService boletaService;

    public BoletaController(BoletaService boletaService) {
        this.boletaService = boletaService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    @Operation(summary = "Crea una compra", description = "El front manda códigos y cantidades; el backend calcula precios, cupón, despacho y descuenta el stock")
    public ResponseEntity<BoletaDTO> crear(@Parameter(hidden = true) Authentication authentication,
                                           @Valid @RequestBody CompraDTO compra) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boletaService.crearCompra(authentication.getName(), compra));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @Operation(summary = "Lista todas las boletas, de la más nueva a la más antigua")
    public List<BoletaDTO> listar() {
        return boletaService.listar();
    }

    @GetMapping("/mis-compras")
    @PreAuthorize("hasRole('CLIENTE')")
    @Operation(summary = "Lista las compras del cliente del token")
    public List<BoletaDTO> misCompras(@Parameter(hidden = true) Authentication authentication) {
        return boletaService.misCompras(authentication.getName());
    }

    @GetMapping("/{numero}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @Operation(summary = "Obtiene el detalle de una boleta")
    public BoletaDTO obtener(@PathVariable Long numero) {
        return boletaService.obtener(numero);
    }

    @PutMapping("/{numero}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cambia el estado de una boleta", description = "PAGADA, ENVIADA, ENTREGADA o ANULADA")
    public BoletaDTO cambiarEstado(@PathVariable Long numero, @Valid @RequestBody EstadoDTO dto) {
        return boletaService.cambiarEstado(numero, dto.estado());
    }

    @DeleteMapping("/{numero}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Anula una boleta", description = "No la borra: la deja ANULADA y devuelve el stock")
    public BoletaDTO anular(@PathVariable Long numero) {
        return boletaService.anular(numero);
    }
}
