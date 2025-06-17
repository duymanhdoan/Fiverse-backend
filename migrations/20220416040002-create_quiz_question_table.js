'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('quiz_question', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      section_content_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'section_contents', key: 'id' }
      },
      question: {
          type: Sequelize.STRING(245),
          allowNull: false
      },
      type: {
          type: Sequelize.INTEGER,
          allowNull: false
      }
       },
       {
        indexes: [
          {
            unique: true,
            fields: ['section_content_id'],
            order: 'ASC',
          }
        ]
      });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('quiz_question');
     
  }
};
