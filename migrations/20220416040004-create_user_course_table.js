'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('user_course', { 
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
      user_id: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      status: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      start_time: {
          type: Sequelize.DATE,
          allowNull: false
      },
      end_time: {
          type: Sequelize.DATE,
          allowNull: false
      },
      token_receive: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValues: 0
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
    await queryInterface.dropTable('user_course');
     
  }
};
