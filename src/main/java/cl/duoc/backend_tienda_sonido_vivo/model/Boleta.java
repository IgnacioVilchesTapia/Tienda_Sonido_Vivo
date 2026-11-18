package cl.duoc.backend_tienda_sonido_vivo.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "boleta")
@Getter
@Setter
@NoArgsConstructor
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long numero;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private EstadoBoleta estado;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_run", nullable = false)
    private Usuario usuario;

    @Column(length = 20)
    private String cupon;

    @Column(nullable = false)
    private Integer subtotal;

    @Column(nullable = false)
    private Integer descuento;

    @Column(nullable = false)
    private Integer despacho;

    @Column(nullable = false)
    private Integer total;

    @Column(nullable = false, length = 150)
    private String calle;

    @Column(length = 50)
    private String depto;

    @Column(nullable = false, length = 60)
    private String region;

    @Column(nullable = false, length = 60)
    private String comuna;

    @Column(length = 300)
    private String indicaciones;

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL)
    private List<DetalleBoleta> detalles = new ArrayList<>();
}
