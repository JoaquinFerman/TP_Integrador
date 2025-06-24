const { Venta, DetalleVenta } = require('../models');

const postVenta = async (req, res) => {
  const { productos, nombre } = req.body;

  if (!productos || !Array.isArray(productos) || productos.length === 0 || !nombre) {
    return res.status(400).json({ error: 'Faltan campos requeridos o formato inválido' });
  }

  try {
    let fecha = new Date()
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // meses van 0-11
    const anio = fecha.getFullYear();
    const nuevaVenta = await Venta.create({
      fecha: `${anio}-${mes}-${dia}`,
      cliente_nombre: nombre
    });

    for (const producto of productos) {
      const { id, count } = producto;
      if (!id || !count) {
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
