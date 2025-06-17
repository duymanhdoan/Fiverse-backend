'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('section_contents', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      section_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'course_sections', key: 'id' }
      },
      type: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      order: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      title: {
          type: Sequelize.STRING(245),
          allowNull: false
      },
      thumbnail_path: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      text_content: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      video_path: {
          type: Sequelize.TEXT,
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
    await queryInterface.dropTable('section_contents');
     
  }
};
