from fastapi import FastAPI
from app.routers import auth, password_reset
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.config import SQLALCHEMY_DATABASE_URL  # Importamos la URL de conexión a la BD
from app.models import user, company, password_reset as pr

# Configuración de la base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear instancia de FastAPI
app = FastAPI()

# Crear tablas en la base de datos
user.Base.metadata.create_all(bind=engine)
company.Base.metadata.create_all(bind=engine)
pr.Base.metadata.create_all(bind=engine)

# Incluir routers
app.include_router(auth.router)
app.include_router(password_reset.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API Multiempresa"}

# Aquí van las rutas, modelos, middlewares, etc.
