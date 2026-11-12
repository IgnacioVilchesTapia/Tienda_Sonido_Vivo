package cl.duoc.backend_tienda_sonido_vivo.security;

import cl.duoc.backend_tienda_sonido_vivo.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey clave;
    private final long minutosAcceso;
    private final long diasRefresh;

    public JwtService(@Value("${app.jwt.secreto}") String secreto,
                      @Value("${app.jwt.minutos-acceso}") long minutosAcceso,
                      @Value("${app.jwt.dias-refresh}") long diasRefresh) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.minutosAcceso = minutosAcceso;
        this.diasRefresh = diasRefresh;
    }

    public String generarToken(Usuario usuario) {
        long duracion = minutosAcceso * 60 * 1000;
        return crearToken(usuario, "acceso", duracion);
    }

    public String generarRefreshToken(Usuario usuario) {
        long duracion = diasRefresh * 24 * 60 * 60 * 1000;
        return crearToken(usuario, "refresh", duracion);
    }

    public String obtenerCorreo(String token) {
        return leerClaims(token).getSubject();
    }

    public String obtenerRol(String token) {
        return leerClaims(token).get("rol", String.class);
    }

    public boolean esTokenDeAcceso(String token) {
        return tieneTipo(token, "acceso");
    }

    public boolean esRefreshToken(String token) {
        return tieneTipo(token, "refresh");
    }

    private String crearToken(Usuario usuario, String tipo, long duracion) {
        Date ahora = new Date();
        Date vence = new Date(ahora.getTime() + duracion);
        return Jwts.builder()
                .subject(usuario.getCorreo())
                .claim("rol", usuario.getRol().name())
                .claim("tipo", tipo)
                .issuedAt(ahora)
                .expiration(vence)
                .signWith(clave)
                .compact();
    }

    private boolean tieneTipo(String token, String tipo) {
        try {
            Claims claims = leerClaims(token);
            return tipo.equals(claims.get("tipo", String.class));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims leerClaims(String token) {
        return Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
