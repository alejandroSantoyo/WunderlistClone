'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserLists = sequelize.define('UserLists', {
        owner: DataTypes.BOOLEAN
    });
    return UserLists;
}