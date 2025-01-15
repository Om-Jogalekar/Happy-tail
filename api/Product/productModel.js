const {DataTypes} = require('sequelize');
const sequelize = require("../../config/dbSquelize");
const User = require('../users/userServices');

const Product = sequelize.define('Product_master' , {
    product_id:{
        type: DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    seller_id:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:"user_master",
            key:'id',
        },
        onDelete:'CASCADE',
    },
    name:{
        type:DataTypes.STRING(100),
        allowNull:false,
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
        validate:{
            min:0,
        },
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:0,
        }
    },
    category:{
        type:DataTypes.STRING(50),
        allowNull:true,
    },
    image:{
        type:DataTypes.STRING(255),
        allowNull:true,
    },
    status:{
        type:DataTypes.ENUM('available' , 'sold', 'removed'),
        defaultValue:'available',
    },
    creaedOn:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
    },
    updatOn:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }},
    {
        timestamps:false,
        tableName:'Products',

});

Product.belongsTo(User,{foreignKey:'seller_id' , as:'seller'});

module.exports = Product;