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
    Task.associate = (models) => {
        Task.belongsTo(models.List, {
            foreignKey: 'listId',
            onDelete: 'CASCADE'
        });
        Task.belongsToMany(models.User, { through: models.UserTasks, as: 'users' })
    };
    return Task;
};