const {DataTypes} = require('sequelize');
const sequelize = require('../../config/dbSquelize');
const User = require("../users/userServices");

const Post = sequelize.define('post_master' , {
    id:{
        type : DataTypes.BIGINT,
        autoIncrement : true,
        primaryKey : true
    },
    userId : {
        type:DataTypes.BIGINT,
        allownull : false,
    },
    content:{
        type:DataTypes.TEXT,
        allownull:false
    },
    media:{
        type:DataTypes.STRING,
        allownull:false
    },
    createdOn : {
        type:DataTypes.DATE,
        defaultValue : DataTypes.NOW
    },
    updatedOn : {
        type:DataTypes.DATE,
        defaultValue : DataTypes.NOW
    }
},{
    tableName:'post_master',
    timestamps:false,
});
Post.belongsTo(User, { foreignKey: 'userId', as: 'User' });

module.exports = Post;