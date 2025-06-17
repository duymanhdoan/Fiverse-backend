const Sequelize = require("sequelize")
const sequelize = require("../database/connection")

module.exports = sequelize.define("quiz_question", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  section_content_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "section_contents",
      key: "id"
    }
  },
  question: {
    type: Sequelize.STRING(245),
    allowNull: false,
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: "quiz_question"
})
