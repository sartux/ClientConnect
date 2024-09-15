// login.js
document.getElementById('forgotPasswordForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('usernameRecovery').value;

    // Enviar la solicitud para obtener el código de recuperación
    fetch('/api/send-reset-code', {  // Asegúrate de que la ruta es correcta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
