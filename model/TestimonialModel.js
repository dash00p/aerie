const Sequelize = require('sequelize');
const conf = require('../conf');
const express= require('express');
const app = express();

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

const model = sequelize.define('testimonial', {
    title: { type: Sequelize.STRING(50), allowNull: false},
    description: { type: Sequelize.STRING, allowNull: false},
    witness : { type: Sequelize.STRING(50), allowNull: false},
    investigationId : Sequelize.INTEGER
  });

if(app.get('env') === 'development')
  model.sync();
  
module.exports = model;