package cl.duoc.backend_tienda_sonido_vivo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.duoc.backend_tienda_sonido_vivo.dto.ProductoDTO;
import cl.duoc.backend_tienda_sonido_vivo.exception.RecursoNoEncontradoException;
import cl.duoc.backend_tienda_sonido_vivo.service.ProductoService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductoController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductoService productoService;

    @Test
    void listarDevuelveLosProductos() throws Exception {
        when(productoService.listar(null, null)).thenReturn(List.of(new ProductoDTO("GA001", "Guitarra Acústica Folk",
                "Yamaha", "F310", "desc", 129990, 8, 3, 0, "/img/guitarras-acusticas.jpg", "Guitarras Acústicas", 1L)));

        mockMvc.perform(get("/api/v1/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].codigo").value("GA001"))
                .andExpect(jsonPath("$[0].categoria").value("Guitarras Acústicas"));
    }

    @Test
    void productoInexistenteResponde404ConFormatoDeError() throws Exception {
        when(productoService.obtener("XX999")).thenThrow(new RecursoNoEncontradoException("No existe el producto XX999"));

        mockMvc.perform(get("/api/v1/productos/XX999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.ruta").value("/api/v1/productos/XX999"));
    }

    @Test
    void crearConPrecioNegativoResponde400() throws Exception {
        String json = """
                {"codigo": "GE099", "nombre": "Guitarra", "precio": -5, "stock": 2, "categoria": "Guitarras Eléctricas"}
                """;

        mockMvc.perform(post("/api/v1/productos").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
