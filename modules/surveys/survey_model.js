const db = require('../../database.js')

var Survey = db.sequelize.define('surveys', {
    user_id: { type: db.Sequelize.STRING, allowNull: false },
    ethnicity: { type: db.Sequelize.STRING, allowNull: true },
    gender: { type: db.Sequelize.STRING, allowNull: true },
    income: { type: db.Sequelize.STRING, allowNull: true },
    employment: { type: db.Sequelize.STRING, allowNull: true },
    sports: { type: db.Sequelize.STRING, allowNull: true },
    travel: { type: db.Sequelize.STRING, allowNull: true },
    fashion: { type: db.Sequelize.STRING, allowNull: true },
    technology: { type: db.Sequelize.STRING, allowNull: true },
    arts: { type: db.Sequelize.STRING, allowNull: true },
    fitness: { type: db.Sequelize.STRING, allowNull: true },
    food: { type: db.Sequelize.STRING, allowNull: true },
    interest: { type: db.Sequelize.STRING, allowNull: true },
    food: { type: db.Sequelize.STRING, allowNull: true }
})

module.exports = Survey