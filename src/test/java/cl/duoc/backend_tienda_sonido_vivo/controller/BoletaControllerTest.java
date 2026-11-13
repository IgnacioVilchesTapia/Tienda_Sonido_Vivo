package cl.duoc.backend_tienda_sonido_vivo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.duoc.backend_tienda_sonido_vivo.dto.BoletaDTO;
import cl.duoc.backend_tienda_sonido_vivo.service.BoletaService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(BoletaController.class)
@AutoConfigureMockMvc(addFilters = false)
class BoletaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BoletaService boletaService;

    @Test
    void listarDevuelveBoletas() throws Exception {
        BoletaDTO boleta = new BoletaDTO(
                1L, LocalDateTime.now(), "PAGADA",
                "12345678-5", "Juan Pérez", "juan@duoc.cl",
                null, 100000, 0, 0, 100000,
                "Av. Pajaritos 100", "", "RM", "Maipú", "",
                List.of()
        );

        when(boletaService.listar()).thenReturn(List.of(boleta));

        mockMvc.perform(get("/api/v1/boletas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].numero").value(1))
                .andExpect(jsonPath("$[0].clienteCorreo").value("juan@duoc.cl"))
                .andExpect(jsonPath("$[0].total").value(100000));
    }

    @Test
    void obtenerPorNumeroDevuelveBoleta() throws Exception {
        BoletaDTO boleta = new BoletaDTO(
                1L, LocalDateTime.now(), "PAGADA",
                "12345678-5", "Juan Pérez", "juan@duoc.cl",
                null, 100000, 0, 0, 100000,
                "Av. Pajaritos 100", "", "RM", "Maipú", "",
                List.of()
        );

        when(boletaService.obtener(1L)).thenReturn(boleta);

        mockMvc.perform(get("/api/v1/boletas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numero").value(1))
                .andExpect(jsonPath("$.estado").value("PAGADA"));
    }
}
