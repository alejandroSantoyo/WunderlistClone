'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        id_device: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    User.associate = (models) => {
        User.belongsToMany(models.List, { through: models.UserLists });
        User.belongsToMany(models.Task, { through: models.UserTasks, as: 'tasks' });
    };
    return User;
};