const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbSquelize');
const User = require("../users/userServices");

const Comment = sequelize.define('comment_master', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    postId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'comment_master',
    timestamps: false,
});

Comment.belongsTo(User, { foreignKey: 'userId', as: 'User' });

module.exports = Comment;