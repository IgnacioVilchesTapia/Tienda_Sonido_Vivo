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

@Entity
@Table(name = "boleta")
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

    public Boleta() {
    }

    public Long getNumero() {
        return numero;
    }

    public void setNumero(Long numero) {
        this.numero = numero;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public EstadoBoleta getEstado() {
        return estado;
    }

    public void setEstado(EstadoBoleta estado) {
        this.estado = estado;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getCupon() {
        return cupon;
    }

    public void setCupon(String cupon) {
        this.cupon = cupon;
    }

    public Integer getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Integer subtotal) {
        this.subtotal = subtotal;
    }

    public Integer getDescuento() {
        return descuento;
    }

    public void setDescuento(Integer descuento) {
        this.descuento = descuento;
    }

    public Integer getDespacho() {
        return despacho;
    }

    public void setDespacho(Integer despacho) {
        this.despacho = despacho;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getDepto() {
        return depto;
    }

    public void setDepto(String depto) {
        this.depto = depto;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public String getIndicaciones() {
        return indicaciones;
    }

    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }

    public List<DetalleBoleta> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleBoleta> detalles) {
        this.detalles = detalles;
    }
}
