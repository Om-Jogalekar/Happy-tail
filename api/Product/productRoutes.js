const express = require('express');
const router = express.Router();
const productController = require("./productController");
const upload = require("../../services/multerConfig");

router.post('/create', upload.array('productImages'), async (req, res, next) => {
    try {
        console.log('Parsed Body:', req.body);
        console.log('Files:', req.files);

        if (req.files && req.files.length > 0) {
            await productController.createNewProduct(req, res, next);
        } else {
            return res.status(400).json({ error: "No files uploaded or invalid file type." });
        }
    } catch (error) {
        next(error); // Pass errors to your error handling middleware
    }
});

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/user/:id', productController.getProductByUserId);
router.put('/:id', upload.single('productImage'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


module.exports = router;