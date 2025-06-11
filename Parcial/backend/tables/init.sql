CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  precio DECIMAL(10,2),
  descripcion TEXT,
  ruta VARCHAR(255)
);

INSERT INTO productos (nombre, precio, descripcion, ruta) VALUES
('Producto 1', 100, 'Descripción del producto 1', '/img/producto1.jpg'),
('Producto 2', 150, 'Descripción del producto 2', '/img/producto2.jpg');


-- mysql -u usuario -p nombre_basededatos < init.sql