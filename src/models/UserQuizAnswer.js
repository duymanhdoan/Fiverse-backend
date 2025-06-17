const Sequelize = require("sequelize")
const sequelize = require("../database/connection")

module.exports = sequelize.define("user_quiz_answer", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  answer_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "quiz_answers",
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
}, {
  timestamps: false,
  tableName: 'user_quiz_answer'
})
