const Sequelize = require("sequelize")
const sequelize = require("../database/connection")

module.exports = sequelize.define("user_section_content", {
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
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'user_section_content'
})
