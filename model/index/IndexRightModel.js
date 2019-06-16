const Sequelize = require('sequelize');
const conf = require('../../conf');
const express = require('express');
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

class IxRight extends Sequelize.Model {}
IxRight.init({
    rightName: { type: Sequelize.STRING(50), allowNull: false }
}, {
  sequelize,
  modelName: 'ix_right'
});


// const model = Sequelize.Model.init({
//     rightName: { type: Sequelize.STRING(50), allowNull: false }
// }, { sequelize, modelName: 'ix_right' });

if (app.get('env') === 'development')
    IxRight.sync();

module.exports = IxRight;