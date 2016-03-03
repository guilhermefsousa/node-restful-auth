var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// configurar um modelo mongoose
var UsuarioSchema = new Schema({
  nome: {
        type: String,
        unique: true,
        required: true
    },
  senha: {
        type: String,
        required: true
    }
});

UsuarioSchema.pre('save', function (next) {
    var usuario = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(usuario.senha, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                usuario.senha = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UsuarioSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.senha, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
