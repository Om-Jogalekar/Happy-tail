const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbSquelize');

const Like = sequelize.define('like_master', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    postId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    createdOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'like_master',
    timestamps: false,
});

module.exports = Like;
