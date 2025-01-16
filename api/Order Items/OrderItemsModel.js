const {DataTypes} = require('sequelize');
const sequelize = require('../../config/dbSquelize');
const Orders = require('../Orders/ordersModel');
const Product = require('../Product/productModel');

const Order_Item = sequelize.define('Order_items' , {
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    order_id:{
        type:DataTypes.BIGINT,
        references:{
            model:"Order",
            key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    },
    product_id:{
        type:DataTypes.BIGINT,
        references:{
            model: "Products",
            key:'product_id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    },
    quantity:{
        type:DataTypes.BIGINT,
        allowNull:false,
    },
    price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
    }},{
        tableName:'Order_Items',
        timestamps:false,
})

Order_Item.belongsTo(Orders , {foreignKey:'order_id' ,as:'order'});
Order_Item.belongsTo(Product , {foreignKey:'product_id' , as:'product'});

module.exports = Order_Item;