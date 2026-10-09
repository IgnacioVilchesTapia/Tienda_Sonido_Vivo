import { useState } from 'react';
import { validarEmail, validarTexto } from '../utils/validaciones';

export default function Contacto() {
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    const resNombre = validarTexto(formData.nombre, 2, 100, 'El nombre');
    if (!resNombre.esValido) nuevosErrores.nombre = resNombre.mensaje;

    const resEmail = validarEmail(formData.email);
    if (!resEmail.esValido) nuevosErrores.email = resEmail.mensaje;

    const resMensaje = validarTexto(formData.mensaje, 10, 500, 'El mensaje');
    if (!resMensaje.esValido) nuevosErrores.mensaje = resMensaje.mensaje;

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true);
      setFormData({ nombre: '', email: '', mensaje: '' });
    }
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold mb-2">Contacto & Asistencia</h1>
        <p className="text-muted">¿Dudas con una guitarra, pedal o tu pedido? Escríbenos y te responderemos a la brevedad.</p>
      </div>

      <div className="row g-5">
        {/* Formulario */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-4 rounded-3 bg-white">
            <h4 className="fw-bold mb-3">Envíanos un Mensaje</h4>

            {enviado && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                ¡Mensaje enviado con éxito! Un especialista de Sonido Vivo se comunicará contigo pronto.
                <button type="button" className="btn-close" onClick={() => setEnviado(false)}></button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Nombre Completo</label>
                <input
                  type="text"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  placeholder="Tu nombre y apellido"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Correo Electrónico</label>
                <input
                  type="email"
                  className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                  placeholder="ejemplo@duoc.cl o @gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label small fw-semibold text-muted">Mensaje o Consulta</label>
                  <span className={`small ${formData.mensaje.length > 500 ? 'text-danger fw-bold' : 'text-muted'}`}>
                    {formData.mensaje.length}/500 caracteres
                  </span>
                </div>
                <textarea
                  className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
                  rows="4"
                  placeholder="Cuéntanos en qué te podemos asesorar…"
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                ></textarea>
                {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
              </div>

              <button type="submit" className="btn btn-amber fw-bold py-2 px-4 shadow-sm">
                <i className="bi bi-send me-2"></i>Enviar Consulta
              </button>
            </form>
          </div>
        </div>

        {/* Información de la Tienda Física */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4 rounded-3 bg-light h-100">
            <h4 className="fw-bold mb-3">Información de la Tienda</h4>

            <div className="d-flex align-items-start gap-3 mb-3">
              <i className="bi bi-geo-alt-fill text-amber fs-4 mt-1"></i>
              <div>
                <strong className="d-block">Dirección en Viña del Mar:</strong>
                <span className="text-secondary small">Av. San Martín 452, Viña del Mar, Región de Valparaíso</span>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-3">
              <i className="bi bi-telephone-fill text-amber fs-4 mt-1"></i>
              <div>
                <strong className="d-block">Teléfono de Contacto:</strong>
                <span className="text-secondary small">+56 32 245 8890 / +56 9 8765 4321</span>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-3">
              <i className="bi bi-envelope-fill text-amber fs-4 mt-1"></i>
              <div>
                <strong className="d-block">Correo de Atención:</strong>
                <span className="text-secondary small">contacto@sonidovivo.cl</span>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <i className="bi bi-clock-fill text-amber fs-4 mt-1"></i>
              <div>
                <strong className="d-block">Horario de Atención:</strong>
                <span className="text-secondary small">Lunes a Viernes: 10:00 - 19:30 hrs</span>
                <span className="text-secondary small d-block">Sábados: 10:30 - 17:00 hrs</span>
              </div>
            </div>

            <div className="mt-auto p-3 bg-white rounded border">
              <span className="badge bg-warning text-dark mb-1">Taller de Luthier</span>
              <p className="small text-muted mb-0">
                Trae tus instrumentos para mantención, cambio de cuerdas y calibración profesional en nuestro taller.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}