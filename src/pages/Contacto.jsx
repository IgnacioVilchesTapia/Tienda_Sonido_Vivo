import { useState } from 'react'

export default function Contacto() {
  const [enviado, setEnviado] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <main className="container my-5">
      <h1 className="mb-4">Contacto</h1>

      {enviado ? (
        <div className="alert alert-success">
          ¡Gracias por comunicarte con Sonido Vivo! Responderemos a tu mensaje a la brevedad.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mensaje o Consulta</label>
            <textarea
              className="form-control"
              rows="4"
              required
              value={formData.mensaje}
              onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">Enviar Mensaje</button>
        </form>
      )}
    </main>
  )
}