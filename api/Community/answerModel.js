const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbSquelize');
const Question = require('./questionModel'); // Import Question model
const User = require('../users/userServices'); // Import User model

const Answer = sequelize.define('answer_master', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    question_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }
}, {
    timestamps: true,
    createdAt: 'createdOn',
    updatedAt: 'updatedOn',
    tableName: 'answer_master'
});

module.exports = Answer;
