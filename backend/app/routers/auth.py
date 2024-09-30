from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token
from app.models import user
from app.database import get_db
from datetime import datetime, timedelta

router = APIRouter()

# Intentos máximos antes de bloquear al usuario
MAX_FAILED_ATTEMPTS = 5
BLOCK_TIME = timedelta(minutes=5)

@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    db_user = db.query(user.User).filter(user.User.username == username).first()
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    # Verificar si está bloqueado
    if db_user.blocked_until and datetime.utcnow() < db_user.blocked_until:
        remaining_time = db_user.blocked_until - datetime.utcnow()
        raise HTTPException(status_code=403, detail=f"Usuario bloqueado. Intenta de nuevo en {remaining_time.seconds // 60} minutos")

    # Verificar contraseña
    if not verify_password(password, db_user.password_hash):
        db_user.failed_attempts += 1
        if db_user.failed_attempts >= MAX_FAILED_ATTEMPTS:
            db_user.blocked_until = datetime.utcnow() + BLOCK_TIME
        db.commit()
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    # Restablecer intentos fallidos después de un login exitoso
    db_user.failed_attempts = 0
    db_user.blocked_until = None
    db.commit()

    # Generar token de acceso
    access_token = create_access_token(data={"sub": db_user.username})

    return {"access_token": access_token, "token_type": "bearer"}
