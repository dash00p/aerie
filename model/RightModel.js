const Sequelize = require('sequelize');
const conf = require('../conf');
const express = require('express');
const app = express();
const ixRight = require('./index/IndexRightModel');

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

class Right extends Sequelize.Model {
    toObject() {
        return this.ixRightId;
    }
}

Right.init({
    userId: Sequelize.INTEGER
}, {
        sequelize,
        modelName: 'right'
    });

//Foreign key
Right.belongsTo(ixRight);

if (app.get('env') === 'development')
    Right.sync();

module.exports = Right;