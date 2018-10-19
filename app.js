const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs')

if (!fs.existsSync("./public")) fs.mkdirSync('public')
if (!fs.existsSync("./public/users-avatars")) fs.mkdirSync('./public/users-avatars')

const { checkJWTAuth } = require('./server/middlewares')
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(checkJWTAuth)
app.use(express.static('public'))

require('./server/routes/')(app);

app.get("*", (req, res) => {
    res.send({ message: "wunderlist Clone App" });
})

module.exports = app;