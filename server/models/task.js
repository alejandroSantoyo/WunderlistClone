'use strict';
module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    finish_date: DataTypes.DATE,
    title: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    dead_line: DataTypes.DATE
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};