CREATE TABLE IF NOT EXISTS Productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  precio DECIMAL(10,2),
  descripcion TEXT,
);

INSERT INTO Productos (nombre, precio, descripcion) VALUES
('Camiseta River', 100, 'Descripción del producto 1'),
('Camiseta Boca', 150, 'Descripción del producto 2');


-- mysql -u usuario -p nombre_basededatos < init.sql