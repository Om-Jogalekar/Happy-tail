const {DataTypes} = require("sequelize");
const sequelize = require("../../config/dbSquelize");
const User = require("../users/userServices");
const Group = require("../Groups/groupsModel");

const Groupmember = sequelize.define('group_member_master' , {
    id:{
        type : DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    groupId:{
        type:DataTypes.BIGINT,
        allowNull:false,
    },
    userId:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    role:{
        type:DataTypes.ENUM('admin','member'),
        allowNull:true,
        defaultValue:'member'
    },
    joinedOn:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW
    }},
    {
        tableName:'group_member_master',
        timestamps:false
});

Groupmember.belongsTo(User , {
    foreignKey:'userId',
    as:'User'
})

Groupmember.belongsTo(Group , {
    foreignKey:'groupId',
    as:'Group',
})

module.exports = Groupmember;