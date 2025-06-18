DROP TABLE IF EXISTS Productos;

CREATE TABLE IF NOT EXISTS Productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  precio REAL,
  categoria TEXT,
  descripcion TEXT
  );

DROP TABLE IF EXISTS Usuarios;

CREATE TABLE IF NOT EXISTS Usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  password TEXT
);

-- sqlite