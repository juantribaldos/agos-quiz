  var models = require('../models/models.js');

  // Autoload - factoriza el codigo si ruta incluye :quizId  
  exports.load = function(req, res, next, quizId) {	  //console.log("Estoy en LOAD");
		//models.Quiz.find(quizId).then(
		models.Quiz.find({ 
			where: { id: Number(quizId) },
			include: [{ model: models.Comment }]
			}).then(function(quiz) { 
	    if (quiz) { req.quiz = quiz; next(); } 
 		else { next( new Error('No existe quizId=' + quizId)) }
					}              
			  ).catch(function(error){ next(error)});			  
	};

    // GET /quizes
  exports.index = function( req, res ) {		//  console.log( "Search: " + req.query.search );	  	
    var cadena = req.query.search;
	if (cadena)		
	  { 		
	  var cadena = "%"+ cadena.replace(/\s+/g,'%' ) + "%" ;	  	
												//  console.log( "Search con %%: " + cadena );	  	
	    models.Quiz.findAll({ where:["upper(pregunta) like ?", cadena.toUpperCase()], order: 'pregunta ASC'}).
	    then(function(quizes) { 
	    res.render('quizes/index.ejs', { quizes: quizes, errors: [] 
	    }); }).catch(function(error) { next(error)});
	  } else {	 
	    models.Quiz.findAll().
	    then(function(quizes) { 
	    res.render('quizes/index.ejs', { quizes: quizes, errors: [] 
	    }); }).catch(function(error) { next(error)});	
			}
  };

//    // GET /quizes
//   exports.buscar = function( req, res ) {	console.log( "Estoy en buscar" );
// 	var lista = "corta";  
// 	models.Quiz.findAll().then(function(quizes) { 
// 	  res.render('quizes/index.ejs', { quizes: quizes, v_lista: lista, errors: [] 
// 	  }); }).catch(function(error) { next(error)});	
//   };

	// GET /quizes/:id	
  exports.show = function(req,res) {	//console.log("Estoy en SHOW");
    //models.Quiz.find(req.params.quizId).then(function(quiz) { 
      res.render('quizes/show', { quiz: req.quiz, errors: [] 
      });	
  };

	// GET /quizes/:id/answer	 
  exports.answer = function(req,res) {	//console.log( "req.query de answer: " + req.query.respuesta + req.query[0] + req.query[1] + req.query[2] );;
	var resultado = 'Incorrecto';
	if ( req.query.respuesta === req.quiz.respuesta )
	  { resultado = 'Correcto'; }
	res.render('quizes/answer',
	  { quiz: req.quiz, respuesta: resultado, errors: [] 
	  });
  };
  
// GET /quizes/new
  exports.new = function(req, res) {	//console.log("Estoy en NEW");
	var quiz = models.Quiz.build( // crea objeto quiz 
	{ pregunta: "Pregunta", respuesta: "Respuesta", tema: "tema" });
  res.render('quizes/new', { quiz: quiz, errors: []});
  };
		// POST /quizes/create
  exports.create = function(req, res){   //console.log("Estoy en CREATE");
    var quiz = models.Quiz.build( req.body.quiz ); 
    var errors = quiz.validate();//ya qe el objeto errors no tiene then(
     if (errors)
    {
        var i=0; var errores=new Array();	//se convierte en [] con la propiedad message por compatibilida con layout
        for (var prop in errors) errores[i++]={message: errors[prop]};       
        res.render('quizes/new', {quiz: quiz, errors: errors});
    } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes')}) ;
    }
};


  // GET /quizes/:id/edit
  exports.edit = function(req, res) {			//console.log("Estoy en EDIT");
    var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

  // PUT /quizes/:id
  exports.update = function(req, res) {			//console.log("Estoy en UPDATE");
    req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema  = req.body.quiz.tema;
    // req.quiz 
	var errors = req.quiz.validate();	//ya que el objeto errors no tiene then(
    
     if (errors)
    {
        var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
        for (var prop in errors) errores[i++]={message: errors[prop]};       
        res.render('quizes/new', {quiz: req.quiz, errors: errors});
    } else {
        req.quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes')}) ;
    }
  };		
//	.validate()
//	.success(
//  function(err){
//    if (err) {
//      res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
//    } else {
//      req.quiz     // save: guarda campos pregunta y respuesta en DB
//      .save( {fields: ["pregunta", "respuesta"]})
//      .success( function(){ res.redirect('/quizes');});
//    }     // Redirección HTTP a lista de preguntas (URL relativo)
//  })
      
		// DELETE /quizes/:id
  exports.destroy = function(req, res) {  	//console.log("Estoy en DELETE");
    req.quiz.destroy().then( function() {
      res.redirect('/quizes');
    }).catch(function(error){next(error)});
  };

//{
//   where: {
//                id: Number(quizId)
//            },
//            include: [{
//                model: models.Comment }]
//        }
