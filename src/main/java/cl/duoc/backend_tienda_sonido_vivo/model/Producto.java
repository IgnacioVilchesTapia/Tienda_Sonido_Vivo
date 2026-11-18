package cl.duoc.backend_tienda_sonido_vivo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
public class Producto {

    @Id
    @Column(length = 10)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 60)
    private String marca;

    @Column(length = 60)
    private String modelo;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Integer stockCritico;

    @Column(nullable = false)
    private Integer descuento = 0;

    @Column(length = 200)
    private String imagen;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;
}
