'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('users', { 
      id: {
        type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      email: {
          type: Sequelize.STRING(200),
          allowNull: false,
          unique: true,
          validate: {
             isEmail: true
            }
      },
      password: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      username: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      role: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
      
       },
      login_count: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
      },
      lock_status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false
      },
      token: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
       });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
     
  }
};
