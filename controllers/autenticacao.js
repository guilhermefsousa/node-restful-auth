var config = require('../config/database'), // pega o arquivo de configuração db
    jwt = require('jwt-simple'),
    Usuario = require('../models/usuario'); // pega o model mongoose

var controller = {};

controller.autenticar = (req, res) => {
    Usuario.findOne({
        nome: req.body.nome
    }, (err, usuario) => {
        if (err)
            throw err;
        if (!usuario)
            res.status(403).send({ sucesso: false, msg: 'Falha na autenticação, usuário ou senha não encontrado' });
        else
            usuario.comparePassword(req.body.senha, (err, existe) => {
                console.log(existe);
                if (existe && !err) {
                    var token = jwt.encode(usuario, config.segredo);
                    res.status(200).json({ sucesso: true, token: 'JWT ' + token });
                }
                else
                    res.status(403).send({ sucesso: false, msg: 'Falha na autenticação, usuário ou senha não encontrado' });
            });
    });
}

module.exports = controller;
