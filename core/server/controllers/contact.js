/**
 * Main controller for Ghost contact
 */

/*global require, module */

var mailer = require('../mail'),
    config = require('../config'),
    contactControllers;

contactControllers = {
    doSend: function (req, res) {
        var email = req.body.email,
            name  = req.body.name,
            text  = req.body.message,
            message = {
                to: config.mail.to,
                from: email,
                subject: config.mail.pre_subject+' Contacto formulario',
                html: 'Nombre: <strong>' + name + '</strong><br>' +
                      'Email: <strong>' + email + '</strong><br>' +
                      'Mensaje: <strong>' + text + '</strong><br>'
            };
        mailer.send(message).then(function success() {
            res.status(200).json({result: true});
        }, function failure(error) {
            res.status(401).json({result: false, error: error});
        });
    }
};

module.exports = contactControllers;
