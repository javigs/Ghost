/**
 * Main controller for Ghost contact
 */

/*global require, module */

var api    = require('../api'),
	mailer = require('../mail'),
    config = require('../config'),
    contactControllers;

contactControllers = {
    'doSend': function (req, res) {
        var email = req.body.email,
			name  = req.body.name,
			text  = req.body.message,
			message = {
                    to: 'javigs@gmail.com',
					from: email,
                    subject: '[JaviBlog] Contacto formulario',
                    html: 'Nombre: <strong>' + name + '</strong><br>' + 
                          'Email: <strong>' + email + '</strong><br>' + 
                          'Mensaje: <strong>' + text + '</strong><br>'
					};
					
		mailer.send(message).then(function success() {
			res.json(200, {result: true});
        }, function failure(error) {
			res.json(401, {result: false, error: error});
        });
    }
};

module.exports = contactControllers;
