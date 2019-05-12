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

const model = sequelize.define('event', {
    title: { type: Sequelize.STRING(50), allowNull: false},
    description: { type: Sequelize.STRING, allowNull: false},
    start: { type: 'TIMESTAMP', allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
    end: { type: 'TIMESTAMP', allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
    type : Sequelize.TINYINT
  });

if(!conf.isProd)
  model.sync();
  
module.exports = model;