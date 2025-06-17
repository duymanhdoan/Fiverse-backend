'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('user_quiz_answer', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      answer_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'quiz_answers', key: 'id' }
      }
       },
       {
        indexes: [
          {
            unique: true,
            fields: ['answer_id'],
            order: 'ASC',
          }
        ]
      });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_quiz_answer');
     
  }
};
