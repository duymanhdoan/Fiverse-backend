const Sequelize = require("sequelize")
const sequelize = require("../database/connection")

module.exports = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
        allowNull: false,
    }
})