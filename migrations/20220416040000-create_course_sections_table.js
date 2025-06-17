'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('course_sections', { 
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'courses', key: 'id' }
    },
      title: {
          type: Sequelize.STRING(245),
          allowNull: false
      },
      type: {
          type: Sequelize.TEXT,
          allowNull: false
      }
       },
       {
        indexes: [
          {
            unique: true,
            fields: ['course_id'],
            order: 'ASC',
          }
        ]
      });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('course_sections');
     
  }
};
