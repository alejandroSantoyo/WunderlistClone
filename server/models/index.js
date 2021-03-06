'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};

if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync();

// db.Task.findById(1)
// .then( task => {
//     task.update({ finish_date: new Date(),
//         title: "Test",
//         status: false,
//         dead_line: new Date(), listId: 1 })
// })




const sequelizeStream = require('sequelize-stream');
const stream = sequelizeStream(sequelize);
stream.on('data', ({ instance, event }) => {
    if (instance._modelOptions.name.singular == "User") {
        console.log("Don't send emit")
        console.log(event, instance.toJSON())
    }
})

module.exports = db;
