const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbSquelize');
const User = require('../users/userServices');
const Answer = require('./answerModel');

const Question = sequelize.define('question_master', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    tags: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    enabled: { 
        type: DataTypes.ENUM('1', '0'), 
        defaultValue: '1', 
        allowNull: false 
    },
}, {
    timestamps: true,
    createdAt: 'createdOn',
    updatedAt: 'updatedOn',
    tableName: 'question_master'
});

module.exports = Question;
