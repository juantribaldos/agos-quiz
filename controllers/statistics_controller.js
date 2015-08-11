var models = require('../models/models.js');

var statistics = {
      quizes: 0,
      comments: 0,
      commentsUnpublished: 0,
      commentedQuizes:0,
      Media_comentarios:0,      
    };

var errors = [];

exports.calculate = function (req, res, next) {
	
	// NOTE: Usar promesas (Promise.all) sería mejor, ya que se podrían
	// lanzar todas las consultas simultáneamente
  models.Quiz.count()
  .then(function (numQuizes) { // número de preguntas
    statistics.quizes = numQuizes;
    return models.Comment.count();
  })
  .then(function (numComments) { // número de comentarios
    statistics.comments = numComments;
    return models.Comment.countUnpublished();
  })
  .then(function (numUnpublished) { // número de comentarios sin publicar
    statistics.commentsUnpublished = numUnpublished;
    return models.Comment.countCommentedQuizes();
  })
  .then(function (numCommented) { // número de preguntas con comentario
    statistics.commentedQuizes = numCommented;
  })
  .catch(function (err) { errors.push(err); })
  .finally(function () {
    next();
  });
};

		// GET /quizes/statistics
exports.show = function (req, res) {
       var statistics={ n_preguntas: ' -- ',
             n_comentarios: ' -- ',
                 promedio_comentarios: ' -- ',
                 preg_sin_com: ' -- ',
                 preg_con_com: ' -- ',
                 comentarios_no_pub: '--'
                };
                //SQlite no acepta campos booleanos, así que lo convierto a 1
      var publish = true;
      if(models.dialect === 'sqlite'){
        publish = 1;
    }
    models.sequelize.query('SELECT count(*) AS n FROM "Quizzes"').then(function(cuenta) {//nº de preguntas
        statistics.n_preguntas=cuenta[0].n;
        models.sequelize.query('SELECT count(*) AS n FROM "Comments"').then(function(cuenta) {//nº de comentarios
            statistics.n_comentarios=cuenta[0].n;
            if(+statistics.n_preguntas>0) statistics.promedio_comentarios=cuenta[0].n/statistics.n_preguntas;//si es 0 el número de preguntas no está definido
            models.sequelize.query('SELECT count(*) AS n FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "QuizId" FROM "Comments")').then(function(cuenta) {//nº de preguntas con comentario
                statistics.preg_con_com=cuenta[0].n;
                statistics.preg_sin_com=+statistics.n_preguntas-cuenta[0].n;
                models.sequelize.query('SELECT count(*) AS n FROM "Comments" WHERE NOT "publicado"').then(function(cuenta) {//nº de comentarios no publicados
                    statistics.comentarios_no_pub=cuenta[0].n;
					res.render('statistics/show', { statistics: statistics, errors: errors });
               });
            });
        });
     });
};

