const Sequelize = require('sequelize');
const conf = require('../conf');

const sequelize = new Sequelize(conf.db.name, conf.db.username, conf.db.password, {
    host: conf.db.host,
    dialect: conf.db.dialect,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    // SQLite only
    //storage: 'path/to/database.sqlite',
  
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
  });

const model = sequelize.define('user', {
    username: Sequelize.STRING(50),
    password: Sequelize.STRING,
    email: Sequelize.STRING(100),
    rank: Sequelize.TINYINT
  });

module.exports = model;