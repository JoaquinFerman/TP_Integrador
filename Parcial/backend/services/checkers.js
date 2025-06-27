const { Product } = require('../models');
const categories = ['camiseta', 'zapatilla']


async function checkProduct(fields) {
	let dbValues;
	if (fields.id) {
		const dbProducto = await Product.findByPk(fields.id);
		if (!dbProducto) {
			throw new Error('Producto no encontrado en la base de datos');
		}
		if(isNaN(Number(fields.id)) || fields.id < 1){
			throw new Error('ID debe ser un numero mayor 0');
		}
		dbValues = dbProducto.get();
	}
	
	const checkedFields = { ...fields };
	const forValues = dbValues ? dbValues : checkedFields
	
	for (const key in forValues) {
		if (fields.id && (checkedFields[key] === null || checkedFields[key] === undefined)) {
			checkedFields[key] = dbValues[key];
		} else {
			console.log("else")
			if(key == 'price' && (isNaN(Number(checkedFields[key])) || checkedFields[key] < 1)) {
				throw new Error('Precio debe ser un numero mayor a 0')
			}
			if(key == 'count' && (isNaN(Number(checkedFields[key])) || checkedFields[key] < 1)){
				throw new Error('Cantidad debe ser un numero mayor a 0')
			}
			if(key == 'active' && (isNaN(Number(checkedFields[key])) || !([0, 1].includes(Number(checkedFields[key]))))){
				throw new Error('Activo debe ser 0 o 1')
			}
			if(key == 'category' && !categories.includes(checkedFields[key])){
				console.log(checkedFields[key])
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
	} catch (e){
		throw new Error('Error durante la validacion de un producto: ' + e.message || String(e))
	}
}

module.exports = {
    checkProduct,
	checkCart
};