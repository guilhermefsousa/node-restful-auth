/* jshint esversion: 6*/
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    mongoose    = require('mongoose'),
    passport	  = require('passport'),
    config      = require('./config/database'), // pega o arquivo de configuração db
    Usuario     = require('./app/models/usuario'), // pega o model mongoose
    port        = process.env.PORT || 8080,
    jwt         = require('jwt-simple');

// obter os nossos parâmetros de solicitação
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use o pacote de passaporte em nossa aplicação
app.use(passport.initialize());

// Demonstração Rota ( GET http://localhost:8080 )
app.get('/', (req, res) => {
  res.send('Welcome, The API is at http://localhost:' + port + '/api');
});

// conectando ao banco de dados
mongoose.connect(config.database);

// passa passaporte para a configuração
require('./config/passport')(passport);

// Agrupando as rotas
var apiRoutes = express.Router();

// Rota cadastro
apiRoutes.post('/cadastro', (req, res) => {
  console.log(req.body);
    if(!req.body.nome || !req.body.senha)
      res.json({sucesso: false, msg: 'Por favor informe nome e senha'});
    else{
      var novoUsuario = new Usuario({
        nome: req.body.nome,
        senha: req.body.senha
      });
      //Salvando o usuário
      novoUsuario.save((err) => {
        if(err)
          res.json({sucesso: false, msg: 'Usuário já existente'});
        else {
          res.json({sucesso: true, msg: 'Usuario criado com sucesso!'});
        }
      });
    }
});

// Rota autenticação para pegar token
apiRoutes.post('/autenticar', (req, res) => {
  console.log(req.body);
  Usuario.findOne({
    nome: req.body.nome
  }, (err, usuario) => {
    if(err)
      throw err;
    if(!usuario)
      res.status(403).send({sucesso: false, msg: 'Falha na autenticação, usuário ou senha não encontrado'});
    else
        usuario.comparePassword(req.body.senha, (err, existe) => {
        console.log(existe);
        if(existe && !err){
          var token = jwt.encode(usuario, config.segredo);
          res.status(200).json({sucesso: true, token: 'JWT ' + token});
        }
        else
          res.status(403).send({sucesso: false, msg: 'Falha na autenticação, usuário ou senha não encontrado'});
      });
  });
});

// Rota área mebros
apiRoutes.get('/areamembros', passport.authenticate('jwt', {session: false}),(req, res) => {
  var token = getToken(req.headers);
  if(token){
    var decodificado = jwt.decode(token, config.segredo);
    Usuario.findOne({
      nome: decodificado.nome
    }, (err, usuario) => {
      if(err)
        throw err;
      if(!usuario)
        res.status(403).send({sucesso: false, msg: 'Falha na autenticação, usuário ou senha não encontrado'});
      else {
        res.status(200).json({sucesso: true, msg: 'Bem vindo a área de membros ' + usuario.nome +'!'});
      }
    });
  }
  else
    res.status(403).send({sucesso: false, msg: 'Token não fornecido.'});
});

getToken = (headers) => {
  if(!headers && !headers.Authorization)
    return null;

  var token = headers.authorization.split(' ');
  if(token.length === 2)
    return token[1];
  else
    return null;
};

app.use('/api',apiRoutes);

app.listen(port, () => {
  console.log('Api running http://localhost:' + port);
});
