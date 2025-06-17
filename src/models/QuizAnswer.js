const Sequelize = require("sequelize")
const sequelize = require("../database/connection")

module.exports = sequelize.define("quiz_answer", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  question_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "quiz_question",
      key: "id"
    }
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  is_true: {
    type: Sequelize.TINYINT,
    allowNull: false
  },
  order: {
    type: Sequelize.STRING(245),
    allowNull: false
  }
}, {
  timestamps: false,
})
