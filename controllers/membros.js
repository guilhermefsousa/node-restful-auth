var Usuario = require('../models/usuario'), // pega o model mongoose
    passport = require('passport'),
    config = require('../config/database'), // pega o arquivo de configuração db
    jwt = require('jwt-simple');

var controller = {};

controller.cadastro = (req, res) => {
    if (!req.body.nome || !req.body.senha)
        res.json({ sucesso: false, msg: 'Por favor informe nome e senha' });
    else {
        var novoUsuario = new Usuario({
            nome: req.body.nome,
            senha: req.body.senha
        });
        //Salvando o usuário
        novoUsuario.save((err) => {
            if (err)
                res.json({ sucesso: false, msg: 'Usuário já existente' });
            else {
                res.json({ sucesso: true, msg: 'Usuario criado com sucesso!' });
            }
        });
    }
};

controller.areaMembros = (req, res) => {
    var token = getToken(req.headers);
    if (!token)
        res.status(403).send({ sucesso: false, msg: 'Token não fornecido.' });
    else {
        var decodificado = jwt.decode(token, config.segredo);
        Usuario.findOne({
            nome: decodificado.nome
        }, (err, usuario) => {
            if (err)
                throw err;
            if (!usuario)
                res.status(403).send({ sucesso: false, msg: 'Falha na autenticação, usuário ou senha não encontrado' });
            else {
                res.status(200).json({ sucesso: true, msg: 'Bem vindo a área de membros ' + usuario.nome + '!' });
            }
        });
    }
};

function getToken(headers) {
    if (!headers && !headers.Authorization)
        return null;

    var token = headers.authorization.split(' ');
    if (token.length === 2)
        return token[1];
    else
        return null;
};

module.exports = controller;
