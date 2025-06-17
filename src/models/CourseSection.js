const Sequelize = require("sequelize")
const sequelize = require("../database/connection")

module.exports = sequelize.define("course_sections", {
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
  title: {
    type: Sequelize.STRING(245),
    allowNull: false,
  },
  type: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: false
})
