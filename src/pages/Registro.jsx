import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Registro() {
  const navigate = useNavigate()
  const [registro, setRegistro] = useState({ nombre: '', email: '', clave: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Usuario registrado exitosamente en Sonido Vivo.')
    navigate('/login')
  }

  return (
    <main className="container my-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: '450px' }}>
        <h2 className="text-center mb-4">Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              required
              value={registro.nombre}
              onChange={(e) => setRegistro({ ...registro, nombre: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              required
              value={registro.email}
              onChange={(e) => setRegistro({ ...registro, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              required
              value={registro.clave}
              onChange={(e) => setRegistro({ ...registro, clave: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Crear Cuenta</button>
        </form>
      </div>
    </main>
  )
}