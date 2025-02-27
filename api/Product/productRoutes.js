const express = require('express');
const router = express.Router();
const productController = require("./productController");

router.post('/create',productController.createNewProduct);
router.get('/',productController.getAllProducts);
router.get('/:id',productController.getProductById);
router.put('/:id',productController.updateProduct);
router.delete('/:id',productController.deleteProduct);


module.exports = router;