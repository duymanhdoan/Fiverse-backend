const Sequelize = require("sequelize")
const sequelize = require("../database/connection")

module.exports = sequelize.define("content_documents", {
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
  path: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  order: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
})
