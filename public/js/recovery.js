document.getElementById('recovery-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/send-recovery-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Código de recuperación enviado. Revisa tu correo.');
        } else {
            alert('Error al enviar el código: ' + result.message);
        }
    } catch (error) {
        alert('Error en la solicitud: ' + error.message);
    }
});
