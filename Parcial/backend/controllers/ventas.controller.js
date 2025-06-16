const db = require('../services/db')

const postVenta = function(req, res) {
    const { productos, nombre } = req.body;

    const queryVenta = `
    INSERT INTO Ventas (fecha, cliente_nombre)
    VALUES (?, ?)`
    db.all(queryVenta, [new Date(), nombre], (err, result) => {
        if(err) {
            console.error('Error al realizar compra:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        const ventaId = result.insertId;
    })

    for (const producto of productos) {
        const { id, precio, count } = producto;
        if (!id || !precio || !count) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const queryDetalle = `
        INSERT INTO DetalleVenta (id_venta, id_producto, cantidad)
        VALUES (?, ?, ?)`;
        db.all(queryDetalle, [ventaId, id, count], (err, result) => {
            if (err) {
                console.error('Error al realizar venta:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
        });
    }
}

module.exports = {
    postVenta
};