'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('user_section', { 
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
      section_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'course_sections', key: 'id' }
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
            fields: ['section_id'],
            order: 'ASC',
          }
        ]
      });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_section');
     
  }
};
