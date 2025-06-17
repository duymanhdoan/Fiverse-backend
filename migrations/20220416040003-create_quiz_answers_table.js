'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('quiz_answers', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      question_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'quiz_question', key: 'id' }
      },
      order: {
          type: Sequelize.STRING(245),
          allowNull: false
      },  
      content: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      is_true: {
          type: Sequelize.BOOLEAN,
          allowNull: false
      }
       },
       {
        indexes: [
          {
            unique: true,
            fields: ['question_id'],
            order: 'ASC',
          }
        ]
      });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('quiz_answers');
     
  }
};
