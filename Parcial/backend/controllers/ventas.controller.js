const { Venta, DetalleVenta } = require('../models');

const postVenta = async (req, res) => {
  const { productos, nombre } = req.body;

  if (!productos || !Array.isArray(productos) || productos.length === 0 || !nombre) {
    return res.status(400).json({ error: 'Faltan campos requeridos o formato inválido' });
  }

  try {
    const nuevaVenta = await Venta.create({
      fecha: new Date(),
      cliente_nombre: nombre
    });

    for (const producto of productos) {
      const { id, precio, count } = producto;
      if (!id || !precio || !count) {
        return res.status(400).json({ error: 'Faltan campos requeridos en productos' });
      }

      await DetalleVenta.create({
        id_venta: nuevaVenta.id,
        id_producto: id,
        cantidad: count
      });
    }

    res.status(201).json({ message: 'Venta registrada', id: nuevaVenta.id });
  } catch (err) {
    console.error('Error al realizar compra:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  postVenta
};
