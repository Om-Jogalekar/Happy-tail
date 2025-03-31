const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbSquelize');

const Appointment = sequelize.define('appointments', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    appointment_date: { type: DataTypes.DATE, allowNull: false },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'canceled'),
        defaultValue: 'pending'
    },
    enabled: { type: DataTypes.ENUM, values: ['0', '1'], defaultValue: '1', allowNull: false },
}, {
    timestamps: true,
    createdAt: 'createdOn',
    updatedAt: 'updatedOn',
    tableName: 'appointments'
});

module.exports = Appointment;
