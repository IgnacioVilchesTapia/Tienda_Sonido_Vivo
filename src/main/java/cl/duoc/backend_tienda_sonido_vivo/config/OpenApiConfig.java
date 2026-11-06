package cl.duoc.backend_tienda_sonido_vivo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI sonidoVivoOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Sonido Vivo")
                        .version("v1")
                        .description("API REST de la tienda de instrumentos Sonido Vivo (DSY1104, Duoc UC).")
                        .contact(new Contact().name("Equipo Sonido Vivo")))
                .servers(List.of(new Server().url("/").description("Servidor actual")));
    }
}
