'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('courses', { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      type: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      level: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      token_receive_per_user: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      total_token_allocation: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      total_time: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    expired_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      title: {
        type: Sequelize.STRING(300),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      provider_name: {
        type: Sequelize.STRING(245),
        allowNull: false
      },
      provider_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      thumbnail_path: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt:{
        allowNull: false,
        type: Sequelize.DATE
      },
      created_by: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_by:{
        allowNull: false,
        type: Sequelize.DATE
      }
       });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('courses');
     
  }
};
