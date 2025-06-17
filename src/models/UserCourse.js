const Sequelize = require("sequelize")
const sequelize = require("../database/connection")

module.exports = sequelize.define("user_course", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  course_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "course",
      key: "id"
    }
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "user",
      key: "id"
    }
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
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'user_course'
})
