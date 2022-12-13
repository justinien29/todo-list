const express = require('express'),
    app = express(),
    compression = require('compression');

require('dotenv').config({
    path: `${__dirname}/.env`
});

// Compression & Parser
app.use(compression());
app.use(express.json())

// Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Routes
app.use('/todo/api', require('./todo/todo.route'));

//unknown route error
app.use((req, res, next) => {
    res.status(404).send('Not found');
});

// Public files
app.use(express.static(__dirname + '/public'));

// Initialize server
app.listen(4000, function() {
    console.log(`Running on port 4000`);
});

module.exports = app;