var router = require('express').Router(),
    passport = require('passport'),
    membrosController = require('../controllers/membros.js'),
    autenticacaoController = require('../controllers/autenticacao.js'),
    indexController = require('../controllers/index.js');
    
// Demonstração Rota ( GET http://localhost:8080 )
router.get('/', indexController.get);

// Rota autenticação para pegar token
router.post('/api/autenticar', autenticacaoController.autenticar);

// Rota cadastro
router.post('/api/cadastro', membrosController.cadastro);

// Rota área mebros
router.get('/api/areamembros', passport.authenticate('jwt', { session: false }), membrosController.areaMembros);

module.exports = router;