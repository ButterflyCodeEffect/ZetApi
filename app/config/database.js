const config = require('./config.js');
const Sequelize = require('sequelize');
const seq = new Sequelize(config.db.name, config.db.user, config.db.pass,{
    host: config.db.host,
    dialect: 'mysql',
    logging: false,
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    }
});

seq.authenticate().then(() => {
    console.info('Connected to database');
}).catch(err => {
    console.error("unable to connect to the database", err);
})

module.exports = {
    Sequelize,
    seq
}