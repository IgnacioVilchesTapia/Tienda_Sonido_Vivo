package cl.duoc.backend_tienda_sonido_vivo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.duoc.backend_tienda_sonido_vivo.dto.ResumenDTO;
import cl.duoc.backend_tienda_sonido_vivo.service.ReporteService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ReporteController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReporteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReporteService reporteService;

    @Test
    void resumenDevuelveDatosDeVentas() throws Exception {
        when(reporteService.generarResumen()).thenReturn(new ResumenDTO(
                1000000L,
                2L,
                500000L,
                Map.of("Guitarras", 1000000L),
                List.of(new ResumenDTO.ProductoVendido("Fender Stratocaster", 2L)),
                List.of(new ResumenDTO.InventarioCategoria("Guitarras", 1, 5, 2500000L))
        ));

        mockMvc.perform(get("/api/v1/reportes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalVentas").value(1000000))
                .andExpect(jsonPath("$.comprasPagadas").value(2))
                .andExpect(jsonPath("$.ticketPromedio").value(500000))
                .andExpect(jsonPath("$.ventasPorCategoria.Guitarras").value(1000000))
                .andExpect(jsonPath("$.masVendidos[0].nombre").value("Fender Stratocaster"));
    }
}
