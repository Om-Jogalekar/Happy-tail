const {DataTypes, Model} = require('sequelize');
const sequelize = require("../../config/dbSquelize");
const User = require("../users/userServices");

const Group = sequelize.define("group_master",{
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    createdBy:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    updatedBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    createdOn:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
    },
    updatedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
},
    {
        tableName: 'group_master',
        timestamps: false,   
});

Group.belongsTo(User,{
    foreignKey:'createdBy',
     as:'creator',
     onDelete:'CASCADE'
    });

Group.belongsTo(User, {
    foreignKey: 'updatedBy',
    as: 'updater',
    onDelete: 'SET NULL',
  });
  
module.exports = Group;