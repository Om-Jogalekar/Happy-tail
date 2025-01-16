const Order_Item = require('./OrderItemsModel');
const Order = require('../Orders/ordersModel');
const Product = require('../Product/productModel');
const User = require('../users/userServices');

exports.createOrderItems = async (req,res)=>{
    try {
        const {order_id,product_id,quantity} = req.body;

        const order = await Order.findByPk(order_id);
        if(!order) return res.status(404).json({error:"no such order exist"});

        const product = await Product.findByPk(product_id);
        if(!product) return res.status(404).json({error:"Product not found"});

        const price = product.price * quantity ;
        const orderItem = await Order_Item.create({
            order_id,
            product_id,
            quantity,
            price
        })

        res.status(200).json(orderItem);

    } catch (error) {
        res.status(500).json(error);
    }
}

exports.getAllOrderItems = async (req,res)=>{
    try {
        const orderItems = await Order_Item.findAll({
            include:[
                {
                    model:Order,
                    as:'order',
                    attributes:['id' , 'buyer_id'],
                    include:[{
                        model:User,
                        as:'buyer',
                        attributes:['username','email'],
                    }]
                },
                {
                    model:Product,
                    as:'product',
                    attributes:['product_id','name','category','image','description']
                },
            ]
        });

        res.status(200).json(orderItems);


    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getOrderItemById = async (req,res)=>{
    try {
        const {id} = req.params;
        const order_Item = await Order_Item.findByPk(id, {
            include:[
                {
                    model:Order,
                    as:'order',
                    attributes:['id' , 'buyer_id'],
                    include:[{
                        model:User,
                        as:'buyer',
                        attributes:['username','email'],
                    }]
                },
                {
                    model:Product,
                    as:'product',
                    attributes:['product_id','name','category','image','description']
                },
            ]
        })

        if(!order_Item) return res.status(404).json({error : "Order item not found"});

        res.status(200).json(order_Item);
    } catch (error) {
        res.status(500).json(error);
    }

};

exports.updateOrderItem = async (req,res)=>{
    try {
        const {id} = req.params;
        const order_Item = await Order_Item.findByPk(id);
        if(!order_Item) return res.status(404).json({error:"Order Item not found"});
        
        const {order_id , product_id , quantity} = req.body;

        const order = await Order.findByPk(order_id);
        if(!order) return res.status(404).json({error:"no such order exist"});

        const product = await Product.findByPk(product_id);
        if(!product) return res.status(404).json({error:"Product not found"});

        const price = product.price * quantity;
        await order_Item.update({
            order_id,
            product_id,
            quantity,
            price,
        });

        res.status(200).json(order_Item);

    } catch (error) {
        res.status(500).json(error);
    }
}

exports.deleteOrderItem = async (req , res)=>{
    try {
        
        const {id} = req.params;
        const order_Item =await Order_Item.findByPk(id);
        if(!order_Item) return res.status(404).json({error:"Order Item not found"});

        await order_Item.destroy();
        res.status(200).json({message:"order_Item deleted successfully"});

    } catch (error) {
        res.status(500).json(error);
    }
}

