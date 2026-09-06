document.addEventListener('DOMContentLoaded', () => {
    const formNuevo = document.getElementById('form-usuario-nuevo');
    if (formNuevo) {
        formNuevo.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'usuarios.html';
        });
    }

    const formEditar = document.getElementById('form-usuario-editar');
    if (formEditar) {
        formEditar.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'usuarios.html';
        });
    }
});