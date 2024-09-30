from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import user, password_reset as pr
from app.core.security import hash_password
from app.core.email import send_reset_email
from app.database import get_db
from datetime import datetime, timedelta
import uuid

router = APIRouter()

TOKEN_EXPIRATION = timedelta(minutes=30)

@router.post("/forgot-password")
def forgot_password(username: str, db: Session = Depends(get_db)):
    db_user = db.query(user.User).filter(user.User.username == username).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    # Generar token de recuperación
    reset_token = str(uuid.uuid4())
    expiration_time = datetime.utcnow() + TOKEN_EXPIRATION

    # Guardar el token en la base de datos
    db_token = pr.PasswordResetToken(user_id=db_user.id, token=reset_token, expires_at=expiration_time)
    db.add(db_token)
    db.commit()

    # Enviar correo con el token
    send_reset_email(db_user.email, reset_token)

    return {"message": f"Se ha enviado un código de recuperación a: {db_user.email[:2]}****{db_user.email[-2:]}"}

@router.post("/reset-password")
def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    db_token = db.query(pr.PasswordResetToken).filter(pr.PasswordResetToken.token == token).first()

    if not db_token:
        raise HTTPException(status_code=400, detail="Token no válido")

    # Verificar si el token ha expirado
    if db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="El token ha expirado")

    # Obtener el usuario asociado al token
    db_user = db.query(user.User).filter(user.User.id == db_token.user_id).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    # Actualizar la contraseña
    db_user.password_hash = hash_password(new_password)
    db.commit()

    return {"message": "Contraseña actualizada con éxito"}
