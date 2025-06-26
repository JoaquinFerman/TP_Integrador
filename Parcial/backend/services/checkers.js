const { Product } = require('../models');
const categorias = ['camiseta', 'zapatilla']


async function checkProduct(fields) {
	if (isNaN(Number(fields.id)) || fields.id < 1) {
		throw new Error('ID debe ser un numero mayor 0');
	}

	const dbProducto = await Product.findByPk(fields.id);
	if (!dbProducto) {
		throw new Error('Producto no encontrado en la base de datos');
	}

	const dbValues = dbProducto.get();
	
	const checkedFields = { ...fields };
	for (const key in dbValues) {
		if (checkedFields[key] === null || checkedFields[key] === undefined) {
			checkedFields[key] = dbValues[key];
		} else {
			if(key == 'precio' && (isNaN(Number(checkedFields[key])) || checkedFields[key] < 1)) {
				throw new Error('Precio debe ser un numero mayor a 0')
			}
			if(key == 'cantidad' && (isNaN(Number(checkedFields[key])) || checkedFields[key] < 1)){
				throw new Error('Cantidad debe ser un numero mayor a 0')
			}
			if(key == 'activo' && ((isNaN(Number(checkedFields[key])) || !(checkedFields[key] in [0, 1])))){
			
				throw new Error('Activo debe ser 0 o 1')
			}
			if(key == 'categoria' && !(checkedFields[key] in categorias)){
				throw new Error('Categoria no valida')
			}
		}
	}
	
	console.log(checkedFields)
	return checkedFields;
}

async function checkCart(name, cart) {
	try {
		cart.forEach(async product => {
			product = await checkProduct(product)
		});
	} catch {
		pass
	}
	// incompleto
}

module.exports = {
    checkProduct,
	checkCart
};