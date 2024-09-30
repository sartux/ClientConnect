import os
from dotenv import load_dotenv

# Cargar variables de entorno desde un archivo .env
load_dotenv()

# URL de conexión a la base de datos MySQL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root@localhost/gestion_agendas")

# Secretos y configuraciones adicionales
SECRET_KEY = os.getenv("SECRET_KEY", "clave_secreta_predeterminada")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token de autenticación dura 30 minutos
