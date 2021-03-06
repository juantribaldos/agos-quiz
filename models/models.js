	var path = require('path');
		// Postgres 
		// Database_URL = postgres://user:passwd@host:port/database
		// SQLite	
		// DATABASE_URL = sqlite://:@:/
	var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
	var DB_name 	= (url[6]||null);
	var user 		= (url[2]||null);
	var pwd			= (url[3]||null);
	var protocol 	= (url[1]||null); 
	var dialect 	= (url[1]||null);
	var port 		= (url[5]||null);
	var host	 	= (url[4]||null);
	var storage		=process.env.DATABASE_STORAGE;
		
	// Cargar Modelo ORM
	var Sequelize = require('sequelize');
	
		// Usar BBDD SQLite o Postgres
		// var sequelize = new Sequelize(null, null, null,
	var sequelize = new Sequelize(DB_name, user, pwd, 
		//{dialect: "sqlite", storage: "quiz.sqlite"});
	  { dialect:	protocol,
		protocol:	protocol,
		port:		port,
		host:		host,
		storage:	storage,	// solo SQLite (.env)
		omitNull:	true	 });	//solo Postgres				
								
	// Importar la definicion de la tabla Quiz en quiz.js
	console.log(process.env.DATABASE_URL + '   ' + Sequelize.DB_name );
	var quiz_path = path.join(__dirname, 'quiz');
	var Quiz = sequelize.import(quiz_path);
	var comment_path = path.join(__dirname, 'comment');
	var Comment = sequelize.import(comment_path);
	
	Comment.belongsTo(Quiz);  // exportar tabla Quiz
	Quiz.hasMany(Comment,{'constraints': true,'onUpdate': 'cascade','onDelete': 'cascade','hooks': true});
	//Quiz.hasMany(Comment); 
	
	exports.Quiz = Quiz; // exportar definicion de tabla Quiz
	exports.Comment = Comment; //exportar la definición de la tabla Comment
	exports.sequelize = sequelize; //exportamos BD para estadísticas.
	
	//sequelize.sync() crea e inicializa tablas de preguntas en DB
  sequelize.sync().then(function() {
		// success(..) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function (count){  //success : forma antigua
      if(count === 0){	// la tabla se inicializa solo si esta vacia
	    Quiz.create({ pregunta: 'Capital de Italia',
					  respuesta: 'Roma',
					  tema: 'Humanidades' });
	    Quiz.create({ pregunta: 'Capital de Portugal',
					  respuesta: 'Lisboa',
					  tema: 'Humanidades' })
		.then(function(){console.log('Base de datos inicializada')});
						 };   });  });
	// console.log("cuenta count:  "  + Quiz.count);
										
										
