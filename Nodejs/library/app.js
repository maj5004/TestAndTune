'use strict';
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var bookRouter = require('./src/routes/bookRoutes');
app.use(express.static('public'));
app.set('views', 'src/views');
//Jade
//app.set('view engine', 'jade');
//handlebars
//var handlebars = require('express-handlebars');
//app.engine('.hbs', handlebars({extname: '.hbs'}));
//app.set('view engine', '.hbs');
//EJS
app.set('view engine', 'ejs');
app.use('/Books', bookRouter);
app.get('/', function (req, res) {
    res.render('index', {
        title: 'hello from render'
        , nav: [{
                Link: '/Books'
                , Text: 'Books'
            }
            , {
                Link: '/Authors'
                , Text: 'Authors'
            }]
    });
});
app.get('/books', function (req, res) {
    res.send('hello books');
});
app.listen(port, function (err) {
    console.log('hello world');
});