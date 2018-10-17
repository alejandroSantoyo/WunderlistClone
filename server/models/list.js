'use strict';
module.exports = (sequelize, DataTypes) => {
    const List = sequelize.define('List', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });
    List.associate = (models) => {
        List.belongsToMany(models.User, { through: models.UserLists })
    };
    return List;
};