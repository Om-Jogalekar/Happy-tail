const {Op} = require("sequelize");
const Product = require("./productModel");
const User = require("../users/userServices");
const Joi = require("joi");

const productSchema  = Joi.object({
    seller_id: Joi.number().required(),
    name:Joi.string().required(),
    description:Joi.string().max(500),
    price:Joi.number().min(0).required(),
    quantity:Joi.number().min(0).optional(),  
    category:Joi.string().max(50).required(),
    image:Joi.string().uri().allow(null,'').optional(),
    status:Joi.string().valid('available','sold','removed').optional(),
})

exports.createNewProduct = async(req,res)=>{
    const {error , value} = productSchema.validate(req.body);

    if(error) return res.status(400).json({message: error.details[0].message});

    const userExists = await User.findByPk(value.seller_id);
    if (!userExists) {
        return res.status(400).json({ message: "Invalid seller_id. User does not exist." });
    }
    try {
        const product = await Product.create(value);
        res.status(201).json({product});

    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

exports.getAllProducts = async(req,res)=>{
    try {
        const products = await Product.findAndCountAll({
           
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
        res.status(500).json({error:error.message});
    }
}

exports.getProductById = async (req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findByPk(id , {
            include:[

                {
                    model:User,
                    as:'seller',
                    attributes:['id' , 'username' , 'email']   
                },
            ]
        });

        if(!product) return res.status(404).json({message : 'Product not found'});

        res.status(200).json(product);
            

    } catch (error) {
        res.status(500).json({error:error.message});
    }
};

exports.updateProduct = async (req,res)=>{
    const {id} = req.params;
    const {error , value} = productSchema.validate(req.body);

    if(error) return res.status(400).json({message:error.details[0].message});
    try {
        const product = await Product.findOne({where:{product_id:id}});

        if(!product) return res.status(404).json({message : "Product Not Found"});

        await product.update(value);
        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({error:error.message});
};
}

exports.deleteProduct = async (req,res)=>{
    const {id} = req.params;
    try{
        const product = await Product.findOne({where:{product_id:id}});

        if(!product) return res.status(404).json({message:"Product not found"});

        await product.update({status:'removed'});
        res.status(200).json({message:"product removed successfully"});

    }catch(error)
    {
        res.status(500).json({error:error.message});
    }
};
