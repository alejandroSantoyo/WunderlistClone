const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

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