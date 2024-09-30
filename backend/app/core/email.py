import os
import smtplib
from email.mime.text import MIMEText

SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

def send_reset_email(to_email: str, token: str):
    subject = "Código de Recuperación de Contraseña"
    body = f"Usa el siguiente código para restablecer tu contraseña: {token}\nEste código es válido por 30 minutos."

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    # Conectar al servidor SMTP
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
