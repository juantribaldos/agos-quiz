var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');


var routes = require('./routes/index');
// Quitado var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');			
		// uncomment after placing your favicon in /public
app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
		//console.log('dirname: ' + __dirname );
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) { 
    if(req.session.user){						// si estamos en una sesion
        if(!req.session.marcatiempo){			//primera vez se pone la marca de tiempo
            req.session.marcatiempo=(new Date()).getTime();
            console.log( "Marca tiempo: " + req.session.marcatiempo );
            
        }else{
			var entreTiempo = (new Date()).getTime()-req.session.marcatiempo;

            if(entreTiempo > 120000){//se pasó el tiempo y eliminamos la sesión (2min=120000ms)
                console.log("SE ELIMINARA LA SESION UUUUUUUUUUUUUUUUU");
						//delete req.session.user;     //eliminamos la sesion del usuario
				req.session.user.pasaNopasa = "pasa";
						req.session.marcatiempo = null;
				console.log('Voy a VoyVoy a redirect LOGouT');
				res.redirect("/logout");
			}else{		//hay actividad se pone nueva marca de tiempo
				req.session.user.loqueQueda = 120000 - entreTiempo;
                req.session.marcatiempo=(new Date()).getTime();                
				}
			}
    }
next();
});


app.use(function(req, res, next){			
			// guardar path en session.redir para despues de login
	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
		}	
			// Hacer visible req.session en las vistas
	res.locals.session = req.session;	

	next();	
 });

app.use('/', routes);     

				// Quitado app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
	// error handlers
	// development error handler
	// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, errors:[]
        });
    });
  }

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}, errors: []
    });
});

module.exports = app;
