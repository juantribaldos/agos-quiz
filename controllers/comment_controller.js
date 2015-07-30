var models = require('../models/models.js');

		// Get /quizes/:quizId/comments/new
exports.new = function() {
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []}); };

		// Post /quizes/:quizId/comments
exports.create = function(req, res){
  var comment = models.Comment.build(
  { texto: req.body.comment.texto,
    QuizId: req.params.quizId  }    );
  var errors = comment.validate();		//ya que el objeto errors no tiene then
       if (errors)	
    {
        var i=0; var errores=new Array();	//se convierte en [] con la propiedad message por compatibilida con layout
        for (var prop in errors) errores[i++]={message: errors[prop]};  
		res.render('comments/new.ejs',
			{ comment: comment, quizid: req.params.quizId, errors: err.errors })
			.catch(function(error) { next(error)});
	} else {
		comment	// save: guanda en DB campo testo de comment
		.save
		.then(function(){ res.direct('/quizes/' + req.params.quizId )})
		.catch(function(error) { next(error)})
		}							};        
