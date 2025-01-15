const {DataTypes} = require('sequelize');
const sequelize = require('../../config/dbSquelize');
const User = require('../users/userServices');

const Order = sequelize.define('Order',{
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    buyer_id:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:'user_master',
            key:'id',
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
    },
    order_total:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
    },
    status:{
        type:DataTypes.ENUM('pending','completed','cancelled'),
        defaultValue:'pending',
    },
    creatOn:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
    },
    updateOn:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
    }},{

        tableName:'Order',
        timestamps:false
});

Order.belongsTo(User,{foreignKey:'buyer_id',as:'buyer'});

module.exports = Order;