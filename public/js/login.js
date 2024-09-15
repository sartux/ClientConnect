// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const emailSection = document.getElementById('emailSection');
    const codeSection = document.getElementById('codeSection');
    const validateCodeButton = document.getElementById('validateCodeButton');
    const validationMessage = document.getElementById('validationMessage');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatchMessage = document.getElementById('passwordMatchMessage');
    const submitPasswordUpdateButton = document.getElementById('submitPasswordUpdate');
    const updatePasswordForm = document.getElementById('updatePasswordForm');

    // Enviar código de recuperación
    forgotPasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('usernameRecovery').value;

        if (!username) {
            alert('Por favor, ingresa tu usuario.');
            return;
        }

        fetch('/api/send-reset-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message.includes('enviado')) {
                emailSection.style.display = 'none';
                codeSection.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Validar el código de recuperación
    validateCodeButton.addEventListener('click', function () {
        const username = document.getElementById('usernameRecovery').value;
        const code = document.getElementById('recoveryCode').value;

        if (!code) {
            validationMessage.textContent = 'Por favor, ingresa el código de recuperación.';
            return;
        }

        fetch('/api/validate-reset-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Código válido') {
                codeSection.style.display = 'none';
                updatePasswordForm.style.display = 'block';
            } else {
                validationMessage.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Validar contraseñas en tiempo real
    newPasswordInput.addEventListener('input', validatePasswords);
    confirmPasswordInput.addEventListener('input', validatePasswords);

    function validatePasswords() {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            passwordMatchMessage.textContent = 'Las contraseñas no coinciden.';
            submitPasswordUpdateButton.disabled = true;
        } else {
            passwordMatchMessage.textContent = '';
            submitPasswordUpdateButton.disabled = false;
        }
    }

    // Actualizar la contraseña
    updatePasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('usernameRecovery').value;
        const newPassword = newPasswordInput.value;

        if (!newPassword) {
            alert('Por favor, ingresa una nueva contraseña.');
            return;
        }

        fetch('/api/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, newPassword })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'Contraseña actualizada exitosamente') {
                window.location.href = '/login.html'; // Redireccionar al login
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Manejar el inicio de sesión
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Por favor, ingresa tu usuario y contraseña.');
            return;
        }

// Dentro del loginForm.addEventListener
fetch('/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Nombre_Usuario: username, Clave: password }) // Asegúrate de usar los nombres correctos aquí
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        window.location.href = '/dashboard.html'; // Redirigir al dashboard
    } else {
        alert(data.message);
    }
})
.catch(error => {
    console.error('Error:', error);
});

    });
});
