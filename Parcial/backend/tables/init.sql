CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  precio DECIMAL(10,2),
  descripcion TEXT,
);

INSERT INTO productos (nombre, precio, descripcion) VALUES
('Producto 1', 100, 'Descripción del producto 1'),
('Producto 2', 150, 'Descripción del producto 2');


-- mysql -u usuario -p nombre_basededatos < init.sql