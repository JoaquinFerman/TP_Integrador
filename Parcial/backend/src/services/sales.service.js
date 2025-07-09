const { Sale, SaleDetail, Product } = require('../models')

const salesGet = async function(want) {

    const sales = await Sale.findAll();
    
    let returnSales = [];
    
    for (const sale of sales) {
        const saleMessage = { sale_id: sale.id, name: sale.client_name, products: [] , date: sale.date};
        const saleDetails = await SaleDetail.findAll({ where: { id_sale: sale.id } });
        
        for (const saleDetail of saleDetails) {
            let productData = {};
            if (want.length > 0) {
                try{
                    
                    const product = await Product.findByPk(saleDetail.id_product, {
                        attributes: want
                    });
                    if (product) {
                        productData = product.toJSON();
                    }
                } catch {
                    throw new Error('Product parameter not valid')
                }
            }
            saleMessage.products.push({
                product_id: saleDetail.id_product,
                count: saleDetail.count,
                ...productData
            });
        }
        returnSales.push(saleMessage);
    }

    return returnSales
}

module.exports = {
    salesGet
}