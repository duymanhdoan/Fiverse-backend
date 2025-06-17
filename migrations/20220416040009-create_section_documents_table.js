'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('section_documents', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      section_id: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      path: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      order: {
          type: Sequelize.INTEGER,
          allowNull: false
      }
       });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('section_documents');
     
  }
};
