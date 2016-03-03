var app = require('express')(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('./config/database'); // pega o arquivo de configuração db

// obter os nossos parâmetros de solicitação
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use o pacote de passaporte em nossa aplicação
app.use(passport.initialize());

// conectando ao banco de dados
mongoose.connect(config.database);

// passa passaporte para a configuração
require('./config/passport')(passport);

// Agrupando as rotas
app.use('/', require('./routes'));

//start server
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), () => {
    console.log('Api running http://localhost:' + server.address().port);
});
