'use strict';
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        finish_date: {
            type: DataTypes.DATE,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        dead_line: {
            type: DataTypes.DATE,
        }
    });
    Task.associate = function (models) {
        Task.belongsTo(models.List, {
            foreignKey: 'listId',
            onDelete: 'CASCADE'
        })
    };
    return Task;
};