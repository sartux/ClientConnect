--- Creación de la base de datos ClientConnect_V1
CREATE DATABASE ClientConnect_V1;
GO

USE ClientConnect_V1;
GO
----------
CREATE TABLE Empresas (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255) NOT NULL,
    Tipo_Persona NVARCHAR(50) CHECK (Tipo_Persona IN ('Natural', 'Jurídica')) NOT NULL,
    Nit_CC NVARCHAR(50) NOT NULL,
    Razon_Social NVARCHAR(255),
    Plan NVARCHAR(50),
    Fecha_Plan DATE,
    Fecha_Vencimiento DATE,
    Cuenta_Bancaria NVARCHAR(100),
    Estado NVARCHAR(50) DEFAULT 'Activo' -- Puede ser 'Activo' o 'Inactivo'
);
GO
---------
CREATE TABLE Empresas (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255) NOT NULL,
    Tipo_Persona NVARCHAR(50) CHECK (Tipo_Persona IN ('Natural', 'Jurídica')) NOT NULL,
    Nit_CC NVARCHAR(50) NOT NULL,
    Razon_Social NVARCHAR(255),
    [Plan] NVARCHAR(50),  -- Cambio al nombre Plan para evitar conflicto
    Fecha_Plan DATE,
    Fecha_Vencimiento DATE,
    Cuenta_Bancaria NVARCHAR(100),
    Estado NVARCHAR(50) DEFAULT 'Activo' -- Puede ser 'Activo' o 'Inactivo'
);
GO
---------
CREATE TABLE Terceros (
    ID INT PRIMARY KEY IDENTITY(1,1),
    EMPRESA_ID INT NOT NULL,
    Nombre NVARCHAR(255) NOT NULL,
    Tipo_Persona NVARCHAR(50) CHECK (Tipo_Persona IN ('Natural', 'Jurídica')) NOT NULL,
    Nit_CC NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(255),
    Razon_Social NVARCHAR(255),
    Direccion NVARCHAR(255),
    Ciudad NVARCHAR(100),
    Tel_Contacto NVARCHAR(50),
    Correo_Contacto NVARCHAR(255),
    Correo_Facturacion NVARCHAR(255),
    Fecha_Cumpleanos DATE,
    Perfil NVARCHAR(50),
    FOREIGN KEY (EMPRESA_ID) REFERENCES Empresas(ID) -- Asegúrate de que la tabla Empresas ya exista
);
GO
---------
CREATE TABLE Usuarios (
    ID INT PRIMARY KEY IDENTITY(1,1),
    EMPRESA_ID INT,
    Nombre_Usuario NVARCHAR(100) NOT NULL UNIQUE,
    Clave NVARCHAR(255) NOT NULL,
    Rol NVARCHAR(50) CHECK (Rol IN ('Superadmin', 'Empresa', 'Empleado')) NOT NULL,
    Estado NVARCHAR(50) DEFAULT 'Activo',
    Email NVARCHAR(255) NULL;  -- Ajusta el tipo de datos y las restricciones según sea necesario
    RecoveryCode NVARCHAR(50) NULL;  -- Ajusta el tamaño y las restricciones según sea necesario

    FOREIGN KEY (EMPRESA_ID) REFERENCES Empresas(ID)
);
GO
---------
CREATE TABLE Servicios (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255) NOT NULL,
    Categoria NVARCHAR(100),
    Sub_Categoria NVARCHAR(100),
    Estado NVARCHAR(50) DEFAULT 'Activo', -- Puede ser 'Activo' o 'Inactivo'
    Permitir_Documentos BIT DEFAULT 0,
    Historico_Documentos BIT DEFAULT 0,
    Tipo_Control NVARCHAR(50),
    Fecha_Vencimiento DATE NULL
);
GO
---------
CREATE TABLE Categorias (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Estado NVARCHAR(50) DEFAULT 'Activo' -- Puede ser 'Activo' o 'Inactivo'
);
GO
---------
CREATE TABLE SubCategorias (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Categoria_ID INT NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Estado NVARCHAR(50) DEFAULT 'Activo', -- Puede ser 'Activo' o 'Inactivo'
    FOREIGN KEY (Categoria_ID) REFERENCES Categorias(ID)
);
GO
---------
CREATE TABLE Calendarios (
    ID INT PRIMARY KEY IDENTITY(1,1),
    EMPRESA_ID INT,
    Nombre NVARCHAR(255) NOT NULL,
    Estado NVARCHAR(50) DEFAULT 'Activo', -- Puede ser 'Activo' o 'Inactivo'
    Observacion NVARCHAR(255),
    FOREIGN KEY (EMPRESA_ID) REFERENCES Empresas(ID)
);
GO
---------
CREATE TABLE Clientes (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ID_Tercero INT NOT NULL,
    [Plan] NVARCHAR(50),  -- Cambio para evitar conflicto con la palabra reservada
    Fecha_Plan DATE,
    Fecha_Inicio DATE,
    Fecha_Vencimiento DATE,
    Cuenta_Bancaria NVARCHAR(100),
    Servicios BIT DEFAULT 0, -- Ejemplo de check de servicios
    Estado NVARCHAR(50) DEFAULT 'Activo', -- Puede ser 'Activo' o 'Inactivo'
    Observacion_Estado NVARCHAR(255),
    Medio_Notificacion BIT DEFAULT 0,
    Permitir_Documentos BIT DEFAULT 0,
    Historico_Documentos BIT DEFAULT 0,
    Permitir_Descarga BIT DEFAULT 0,
    FOREIGN KEY (ID_Tercero) REFERENCES Terceros(ID)
);
GO
---------
CREATE TABLE Funcionarios (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ID_Tercero INT NOT NULL,
    Fecha_Ingreso DATE,
    Cargo NVARCHAR(100),
    Fecha_Retiro DATE NULL,
    FOREIGN KEY (ID_Tercero) REFERENCES Terceros(ID)
);
GO
---------
CREATE TABLE Planes_Empresas (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    Estado NVARCHAR(50) DEFAULT 'Activo' -- Puede ser 'Activo' o 'Inactivo'
);
GO
---------
CREATE TABLE Planes_Clientes (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    Estado NVARCHAR(50) DEFAULT 'Activo' -- Puede ser 'Activo' o 'Inactivo'
);
GO
---------
CREATE TABLE Medios_Notificacion (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) NOT NULL,
    Estado NVARCHAR(50) DEFAULT 'Activo' -- Puede ser 'Activo' o 'Inactivo'
);
GO
---------
CREATE TABLE Tipo_Control (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    Estado NVARCHAR(50) DEFAULT 'Activo' -- Puede ser 'Activo' o 'Inactivo'
);
GO
---------
CREATE TABLE Eventos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CALENDARIO_ID INT NOT NULL,
    TERCERO_ID INT NOT NULL, -- Para referenciar al cliente o funcionario
    Nombre NVARCHAR(255) NOT NULL,
    Descripcion NVARCHAR(500),
    Fecha DATE NOT NULL,
    Hora TIME NULL,
    Estado NVARCHAR(50) DEFAULT 'Activo', -- Puede ser 'Activo' o 'Inactivo'
    FOREIGN KEY (CALENDARIO_ID) REFERENCES Calendarios(ID),
    FOREIGN KEY (TERCERO_ID) REFERENCES Terceros(ID)
);
GO
---------
CREATE TABLE Documentos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TERCERO_ID INT NOT NULL, -- Para referenciar al cliente o funcionario
    Nombre NVARCHAR(255) NOT NULL,
    Descripcion NVARCHAR(500),
    Fecha_Creacion DATE NOT NULL,
    Tipo NVARCHAR(50), -- Ej. Informe, Acta, etc.
    Ruta NVARCHAR(500) NOT NULL, -- Ruta del archivo en el servidor
    Precio DECIMAL(18,2) NULL, -- Precio si el documento tiene costo
    Estado NVARCHAR(50) DEFAULT 'Activo', -- Puede ser 'Activo' o 'Inactivo'
    FOREIGN KEY (TERCERO_ID) REFERENCES Terceros(ID)
);
GO
---------
CREATE TABLE Pagos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TERCERO_ID INT NOT NULL, -- Para referenciar al cliente
    DOCUMENTO_ID INT NULL, -- Para referenciar el documento si se paga por uno
    Servicio NVARCHAR(255) NULL, -- Descripción del servicio pagado si no es un documento
    Monto DECIMAL(18,2) NOT NULL,
    Fecha DATE NOT NULL,
    Metodo_Pago NVARCHAR(50), -- Ej. Efectivo, Transferencia, Pasarela de Pago
    Estado NVARCHAR(50) DEFAULT 'Completo', -- Puede ser 'Completo', 'Pendiente', etc.
    FOREIGN KEY (TERCERO_ID) REFERENCES Terceros(ID),
    FOREIGN KEY (DOCUMENTO_ID) REFERENCES Documentos(ID)
);
GO
---------
CREATE TABLE Tipo_Evento (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    Estado NVARCHAR(50) DEFAULT 'Activo' -- Puede ser 'Activo' o 'Inactivo'
);
GO
---------
CREATE TABLE Eventos_Tipo (
    ID INT PRIMARY KEY IDENTITY(1,1),
    EVENTO_ID INT NOT NULL,
    TIPO_EVENTO_ID INT NOT NULL,
    FOREIGN KEY (EVENTO_ID) REFERENCES Eventos(ID),
    FOREIGN KEY (TIPO_EVENTO_ID) REFERENCES Tipo_Evento(ID)
);
GO
---------
CREATE TABLE Historial_Citas (
    ID INT PRIMARY KEY IDENTITY(1,1),
    EVENTO_ID INT NOT NULL,
    Fecha_Creacion DATE NOT NULL,
    Estado NVARCHAR(50) DEFAULT 'Completado', -- Puede ser 'Completado', 'Pendiente', 'Cancelado'
    Observaciones NVARCHAR(500),
    FOREIGN KEY (EVENTO_ID) REFERENCES Eventos(ID)
);
GO
---------
CREATE TABLE Historial_Documentos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    DOCUMENTO_ID INT NOT NULL,
    TERCERO_ID INT NOT NULL, -- Para referenciar al cliente o funcionario
    Fecha_Descarga DATE NOT NULL,
    Metodo_Pago NVARCHAR(50) NULL, -- Ej. Efectivo, Transferencia, Pasarela de Pago
    FOREIGN KEY (DOCUMENTO_ID) REFERENCES Documentos(ID),
    FOREIGN KEY (TERCERO_ID) REFERENCES Terceros(ID)
);
GO
---------
CREATE TABLE Configuracion_Plataforma (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Parametro NVARCHAR(100) NOT NULL,
    Valor NVARCHAR(255),
    Descripcion NVARCHAR(500)
);
GO
---------
CREATE TABLE Roles (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    Permisos NVARCHAR(MAX) -- Aquí puedes almacenar JSON o una lista de permisos
);
GO
---------
CREATE TABLE Usuarios_Roles (
    ID INT PRIMARY KEY IDENTITY(1,1),
    USUARIO_ID INT NOT NULL,
    ROL_ID INT NOT NULL,
    FOREIGN KEY (USUARIO_ID) REFERENCES Usuarios(ID),
    FOREIGN KEY (ROL_ID) REFERENCES Roles(ID)
);
GO
---------
CREATE TABLE Logs_Auditoria (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Usuario_ID INT NOT NULL,
    Fecha DATE NOT NULL,
    Accion NVARCHAR(500),
    Tabla NVARCHAR(100),
    Registro_ID INT,
    FOREIGN KEY (Usuario_ID) REFERENCES Usuarios(ID)
);
GO
---------