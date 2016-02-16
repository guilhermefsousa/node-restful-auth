var JwtStrategy = require('passport-jwt').Strategy;

// carregar o modelo de usuário
var Usuario = require('../app/models/usuario');
var config = require('../config/database'); // pegar o aqruivo db config

module.exports = (passport) => {
  var opts = {};
  opts.secretOrKey = config.segredo;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    Usuario.findOne({id: jwt_payload.id}, (err, usuario) => {
          if (err) {
              return done(err, false);
          }
          if (usuario) {
              done(null, usuario);
          } else {
              done(null, false);
          }
      });
  }));
};
