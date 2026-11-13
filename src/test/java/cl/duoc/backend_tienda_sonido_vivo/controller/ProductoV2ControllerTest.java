package cl.duoc.backend_tienda_sonido_vivo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.duoc.backend_tienda_sonido_vivo.dto.PaginaDTO;
import cl.duoc.backend_tienda_sonido_vivo.dto.ProductoDTO;
import cl.duoc.backend_tienda_sonido_vivo.service.ProductoService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductoV2Controller.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductoV2ControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductoService productoService;

    @Test
    void listarPaginadoDevuelveElementos() throws Exception {
        ProductoDTO prod = new ProductoDTO("GA001", "Guitarra Acústica Folk",
                "Yamaha", "F310", "desc", 129990, 8, 3, 0, "/img/guitarras-acusticas.jpg", "Guitarras Acústicas", 1L);

        when(productoService.listarPaginado(0, 10, null, null))
                .thenReturn(new PaginaDTO<>(List.of(prod), 0, 1, 1L));

        mockMvc.perform(get("/api/v2/productos?pagina=0&limite=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pagina").value(0))
                .andExpect(jsonPath("$.totalElementos").value(1))
                .andExpect(jsonPath("$.contenido[0].codigo").value("GA001"));
    }
}
