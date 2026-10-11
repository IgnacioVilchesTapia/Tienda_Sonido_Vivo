export default function Boton({
  texto,
  onClick,
  className = 'btn btn-amber',
  tipo = 'button',
  deshabilitado = false
}) {
  return (
    <button
      type={tipo}
      className={className}
      onClick={onClick}
      disabled={deshabilitado}
    >
      {texto}
    </button>
  );
}
