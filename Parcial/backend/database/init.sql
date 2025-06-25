DROP TABLE IF EXISTS Productos;

CREATE TABLE IF NOT EXISTS Productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  precio REAL,
  categoria TEXT,
  descripcion TEXT,
  activo BOOLEAN
  );

DROP TABLE IF EXISTS Usuarios;

CREATE TABLE IF NOT EXISTS Usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  password TEXT
);

DROP TABLE IF EXISTS Ventas;

CREATE TABLE IF NOT EXISTS Ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    cliente_nombre TEXT NOT NULL,
    total INTEGER
);

DROP TABLE IF EXISTS DetalleVenta;

CREATE TABLE IF NOT EXISTS DetalleVenta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id),
    FOREIGN KEY (id_producto) REFERENCES Productos(id)
);


-- sqlite