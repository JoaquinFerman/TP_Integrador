const { Producto } = require('../models');

async function checkProducto(fields) {
	if (isNaN(Number(fields.id))) {
		throw new Error('ID must be a number');
	}

	const dbProducto = await Producto.findByPk(fields.id);
	if (!dbProducto) {
		throw new Error('Producto not found in database');
	}

	const dbValues = dbProducto.get();
	
	const checkedFields = { ...fields };
	for (const key in dbValues) {
		if (checkedFields[key] === null || checkedFields[key] === undefined) {
			checkedFields[key] = dbValues[key];
		}
	}
	
	console.log(checkedFields)
	return checkedFields;
}

module.exports = {
    checkProducto
};