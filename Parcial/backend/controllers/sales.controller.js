const { Sale, SaleDetail } = require('../models');
const { checkCart } = require('../services/checkers');
const { salesGet } = require('../services/sales.service');

const postSale = async (req, res) => {
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

const getSales = async (req, res) => {
  const { want } = req.query;
  let wantList = [];
  if (Array.isArray(want)) {
    wantList = want;
  } else if (typeof want === 'string') {
    wantList = want.split(',');
  }

  const returnSales = await salesGet(wantList)

  return res.status(200).json({ sales: returnSales });
};

const getSalesPage = async (req, res) => {
    try {
        const sales = await salesGet(['name']);
        res.render('sales', { sales });
    } catch (err) {
        console.error('Error al obtener ventas:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = {
  postSale,
  getSales,
  getSalesPage
};
