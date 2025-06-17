const Sequelize = require("sequelize")
const sequelize = require("../database/connection")

module.exports = sequelize.define("section_contents", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  section_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "course_sections",
      key: "id"
    }
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  order: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING(245),
    allowNull: false
  },
  thumbnail_path: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  text_content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  video_path: {
    type: Sequelize.TEXT,
    allowNull: false
  },
}, {
  timestamps: false
})
