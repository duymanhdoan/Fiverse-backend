'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('user_quiz_answer_text', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      quiz_question_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'quiz_question', key: 'id' }
      },
      answer: {
          type: Sequelize.TEXT,
          allowNull: false
      }
       },
       {
        indexes: [
          {
            unique: true,
            fields: ['quiz_question_id'],
            order: 'ASC',
          }
        ]
      });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_quiz_answer_text');
     
  }
};
