const Product = require("./productModel");
const User = require("../users/userServices");
const Joi = require("joi");
const path = require('path');
const fs = require('fs');

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().max(500),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).optional(),
    category: Joi.string().max(50).required(),
    image: Joi.string().uri().allow(null, '').optional(),
    status: Joi.string().valid('available', 'sold', 'removed').optional(),
})

exports.createNewProduct = async (req, res) => {
    const { error, value } = productSchema.validate(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    const userExists = await User.findByPk(req.appUser.id);
    if (!userExists) {
        return res.status(400).json({ message: "Invalid seller_id. User does not exist." });
    }

    value.seller_id = req.appUser.id;

    // Handle media (uploaded files)
    let media = [];
    if (req.files && req.files.length > 0) {
        media = req.files.map(file => `/uploads/${file.filename}`);
        value.image = JSON.stringify(media); // Ensure this matches your Product model's structure
    }

    try {
        const product = await Product.create(value);
        res.status(201).json({ product });
    } catch (error) {
        // Clean up uploaded files if product creation fails
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '..', 'uploads', file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Failed to delete uploaded image:", err);
                });
            });
        }
        res.status(500).json({ error: error.message });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAndCountAll({
            where: { status: 'available' },
            order: [['creaedOn', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'seller',
                    attributes: ['id', 'username', 'email'],
                },
            ],
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'seller',
                    attributes: ['id', 'username', 'email']
                },
            ]
        });

        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Format image array as a stringified JSON if needed
        product.image = product.image || '[]';

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const products = await Product.findAndCountAll({
            where: { seller_id: id }, // Corrected the `where` clause syntax
            include: [
                {
                    model: User,
                    as: 'seller',
                    attributes: ['id', 'username', 'email']
                },
            ]
        });

        if (!products || products.count === 0) {
            return res.status(404).json({ message: 'No products found for this user.' });
        }

        // Format image arrays for each product
        const formattedProducts = products.rows.map(product => ({
            ...product.toJSON(),
            image: product.image || '[]'
        }));

        res.status(200).json({ count: products.count, products: formattedProducts });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An error occurred while fetching the products.' });
    }
};


exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    if (req.file) {
        updatedData.image = `/uploads/${req.file.filename}`; // Save image path
    }

    try {
        const updatedProduct = await Product.update(updatedData, { where: { product_id: id } });
        if (!updatedProduct[0]) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({ where: { product_id: id } });

        if (!product) return res.status(404).json({ message: "Product not found" });

        await product.update({ status: 'removed' });
        res.status(200).json({ message: "product removed successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
