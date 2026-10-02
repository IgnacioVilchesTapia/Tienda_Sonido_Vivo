import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [credenciales, setCredenciales] = useState({ usuario: '', clave: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Redirección simple simulada
    if (credenciales.usuario === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/')
    }
  }

  return (
    <main className="container my-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario / Correo</label>
            <input
              type="text"
              className="form-control"
              required
              value={credenciales.usuario}
              onChange={(e) => setCredenciales({ ...credenciales, usuario: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              required
              value={credenciales.clave}
              onChange={(e) => setCredenciales({ ...credenciales, clave: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>
      </div>
    </main>
  )
}