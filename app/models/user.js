const { seq, Sequelize } = require('../config/database');

const User = seq.define('user',{
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
});

module.exports = {
    User
}

