'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('user_section_content', { 
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
      section_content_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'section_contents', key: 'id' }
      },
      status: {
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
    await queryInterface.dropTable('user_section_content');
     
  }
};
