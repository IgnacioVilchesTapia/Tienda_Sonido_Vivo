document.addEventListener('DOMContentLoaded', () => {
    const mostrarError = (input, mensaje) => {
        let errorSpan = input.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('msj-error')) {
            errorSpan = document.createElement('span');
            errorSpan.classList.add('msj-error');
            errorSpan.style.color = 'var(--alerta)';
            errorSpan.style.fontSize = '0.875rem';
            errorSpan.style.marginTop = '4px';
            input.parentNode.insertBefore(errorSpan, input.nextSibling);
        }
        errorSpan.textContent = mensaje;
        input.style.borderColor = 'var(--alerta)';
    };

    const limpiarErrores = (formulario) => {
        const errores = formulario.querySelectorAll('.msj-error');
        errores.forEach(error => error.remove());
        const inputs = formulario.querySelectorAll('input, select, textarea');
        inputs.forEach(input => input.style.borderColor = 'var(--linea)');
    };

    const validarEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            limpiarErrores(formLogin);
            let valido = true;

            const correo = document.getElementById('correo-login');
            const pass = document.getElementById('password-login');

            if (!correo.value.trim()) {
                mostrarError(correo, 'El correo es obligatorio.');
                valido = false;
            } else if (!validarEmail(correo.value.trim())) {
                mostrarError(correo, 'Ingresa un correo válido.');
                valido = false;
            }

            if (!pass.value.trim()) {
                mostrarError(pass, 'La contraseña es obligatoria.');
                valido = false;
            }

            if (valido) formLogin.submit();
        });
    }

    const formRegistro = document.getElementById('form-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            limpiarErrores(formRegistro);
            let valido = true;

            const nombre = document.getElementById('nombre-registro');
            const apellido = document.getElementById('apellido-registro');
            const correo = document.getElementById('correo-registro');
            const pass = document.getElementById('password-registro');
            const passConf = document.getElementById('password-confirmar');

            if (!nombre.value.trim()) {
                mostrarError(nombre, 'El nombre es obligatorio.');
                valido = false;
            }
            if (!apellido.value.trim()) {
                mostrarError(apellido, 'El apellido es obligatorio.');
                valido = false;
            }
            if (!correo.value.trim()) {
                mostrarError(correo, 'El correo es obligatorio.');
                valido = false;
            } else if (!validarEmail(correo.value.trim())) {
                mostrarError(correo, 'Ingresa un correo válido.');
                valido = false;
            }
            if (pass.value.length < 8) {
                mostrarError(pass, 'La contraseña debe tener al menos 8 caracteres.');
                valido = false;
            }
            if (pass.value !== passConf.value) {
                mostrarError(passConf, 'Las contraseñas no coinciden.');
                valido = false;
            }

            if (valido) formRegistro.submit();
        });
    }

    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            limpiarErrores(formContacto);
            let valido = true;

            const nombre = document.getElementById('nombre-contacto');
            const correo = document.getElementById('correo-contacto');
            const asunto = document.getElementById('asunto-contacto');
            const mensaje = document.getElementById('mensaje-contacto');

            if (!nombre.value.trim()) {
                mostrarError(nombre, 'El nombre completo es obligatorio.');
                valido = false;
            }
            if (!correo.value.trim()) {
                mostrarError(correo, 'El correo es obligatorio.');
                valido = false;
            } else if (!validarEmail(correo.value.trim())) {
                mostrarError(correo, 'Ingresa un correo válido.');
                valido = false;
            }
            if (!asunto.value) {
                mostrarError(asunto, 'Selecciona un motivo de contacto.');
                valido = false;
            }
            if (!mensaje.value.trim()) {
                mostrarError(mensaje, 'El mensaje no puede estar vacío.');
                valido = false;
            }

            if (valido) formContacto.submit();
        });
    }
});