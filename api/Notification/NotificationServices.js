const {DataTypes} = require('sequelize')
const sequelize = require('../../config/dbSquelize');
const User = require("../users/userServices")

const Notification = sequelize.drfine('notification_master' , {
    id:{
        type:DataTypes.BIGINT(20),
        autoIncreament:true,
        primaryKey:true
    },
    userId:{
        type:DataTypes.BIGINT(20),
        allowNull : false
    },
    type:{
        type:DataTypes.ENUM('0','1','2','3','4','5'),
        allowNull:false
    },
    createdOn : {
        type:DataTypes.DATE,
        defaultValue : DataTypes.NOW
    },
    updatedOn : {
        type:DataTypes.DATE,
        defaultValue : DataTypes.NOW
    }
},
    {
        timestamps:false,
        tableName : 'notification_master'

});

Notification.belongsTo(User , {foreinKey : 'userId' , as:'User'});
module.exports = Notification;