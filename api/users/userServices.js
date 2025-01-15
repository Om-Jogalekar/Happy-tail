const {DataTypes} = require("sequelize");
const sequelize = require("../../config/dbSquelize");

const User = sequelize.define('user_matser' ,{
    id:{
        type : DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING(50),
        allowNull:false,
        unique:true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique:true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique:true
    },
    profile_picture: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    createdOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: true,
        defaultValue: '1',
    },
},
{
    tableName:'user_master',
    timestamps:false   
})

module.exports = User;