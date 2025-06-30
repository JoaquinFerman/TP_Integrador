const { Sale, SaleDetail } = require('../models');
const { checkCart } = require('../services/checkers');

const postVenta = async (req, res) => {
  let { products, name } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0 || !name) {
    return res.status(400).json({ error: 'Faltan campos requeridos o formato inválido' });
  }

  for (let product of products) {
    let {id, count} = product
    if (!id || !count) {
      return res.status(400).json({ error: 'Faltan campos requeridos en productos' });
    }
  }
  console.log(products);
  
  try {
    products = await checkCart(name, products)
  } catch (e) {
    return res.status(400).json({ error: e.message || String(e) })
  }

  try {
    let date = new Date()
    const day = date.getDate();
    const month = date.getMonth() + 1; // meses van 0-11
    const year = date.getFullYear();
    const newSale = await Sale.create({
      date: `${year}-${month}-${day}`,
      client_name: name
    });


    for (const product of products) {
      const { id, count } = product;
      await SaleDetail.create({
        id_sale: newSale.id,
        id_product: id,
        count
      });
    }

    res.status(201).json({ message: 'Venta registrada', id: newSale.id });
  } catch (err) {
    console.error('Error al realizar compra:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const getVentas = async (req, res) => {

  const sales = await Sale.findAll()

  let returnSales = []
  
  for(const sale of sales){
    const saleMessage = {sale_id : sale.id, products : []}
    const saleDetails = await SaleDetail.findAll({where : {id_sale : sale.id}})

    for(const saleDetail of saleDetails){
      saleMessage.products.push({product_id : saleDetail.id_product, count : saleDetail.count})
    }
    returnSales.push(saleMessage)
  }
  return res.status(200).json({sales : returnSales})
}

module.exports = {
  postVenta,
  getVentas
};
