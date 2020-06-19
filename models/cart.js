const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
    static addProduct(id, productPrice) {

        // Fetch the previous cart.......
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [] , totalPrice: 0};
            if(!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find The existing product.......
            const existedProductIndex = cart.products.findIndex( prod => prod.id === id );
            const existedProduct = cart.products[existedProductIndex];
            let updatedProduct;
            if(existedProduct) {
                updatedProduct = {...existedProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existedProductIndex] = updatedProduct; 
            } else {
                updatedProduct = {id: id , qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    };
};