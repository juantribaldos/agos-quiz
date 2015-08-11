	//Definicion del modulo de Comment con validacion

module.exports = function(sequelize, DataTypes) { 
  return sequelize.define( 'Comment', { 
	  texto: { 
	  type: DataTypes.STRING,
	  validate: { notEmpty: {msg: "-> Falta comentario"}}
	  },
      publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
				}
        },   
     {
    classMethods: {
      countUnpublished: function () {
 //       return this.#################
      },
      countCommentedQuizes: function () {
 //       return this.#################
      }
      }
    });	
  };
