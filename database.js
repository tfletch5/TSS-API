const Sequelize = require('sequelize'),
    Op = Sequelize.Op

module.exports = {
    sequelize: new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        operatorsAliases: Op,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }),

    Sequelize: Sequelize
}