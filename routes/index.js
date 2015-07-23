var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

router.get('/author', function(req, res) {		
	res.render('autor', { Autor: 'Juan Carlos de la Iglesia Sanz' }); });


/* GET home page. */
router.get('/', function(req, res) {
				/*  res.render('index', { title: 'Express' });*/
	res.render('index', { title: 'Quiz_JC' }); });

	router.get('/quizes/question', quizController.question);
	router.get('/quizes/answer',   quizController.answer);
	//router.get('/author',   quizController.author);
	
	module.exports = router;
	
