from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(200))
    is_active = Column(Boolean, default=True)
    failed_attempts = Column(Integer, default=0)
    blocked_until = Column(String, nullable=True)  # Fecha y hora de desbloqueo
