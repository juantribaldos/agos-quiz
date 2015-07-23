  var models = require('../models/models.js');
  
// GET /quizes/question  {}<>
//  exports.question = function(req,res) {
// 	 res.render('quizes/question', {pregunta: 'Capital de Italia'});
// };

	  exports.question = function(req,res) {
	//res.render('quizes/question', {pregunta: 'Capital de Italia'});
	models.Quiz.findAll().success(function(quiz) { 
	res.render('quizes/question', { pregunta: quiz[0].pregunta })	
												})		
										};
// GET /quizes/:id/answer	
  exports.answer = function(req,res) {	
//	models.Quiz.find(req.params.quizId).then(function(quiz) { 
    models.Quiz.findAll().success(function(quiz) {  
//	  if (req.query.respuesta === quiz.respuesta)	{ 
	  if (req.query.respuesta === quiz[0].respuesta )	
	  { res.render('quizes/answer',
//			{ quiz: quiz, respuesta: 'Correcto' });
			{ respuesta: 'Correcto' });
	  } else 
	  { res.render('quizes/answer',
//			{ quiz: quiz, respuesta: 'Incorrecto' });
	  		{ respuesta: 'Incorrecto' });
	  }	
  })								};

  
  // GET /quizes/answer
//  exports.answer = function(req, res) {
//	if (req.query.respuesta === 'Roma'){
//		res.render('quizes/answer', {respuesta: 'Correcto'});
//	} else {
//		res.render('quizes/answer', {respuesta: 'Incorrecto'});
//	}
//};
  
