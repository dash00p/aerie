const Sequelize = require('sequelize');
const conf = require('../conf');
//const bcrypt = require();

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

  const User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
  });

  const UserController = {
    sync : async user => {
      await sequelize.sync();
      let result = await User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20)
      });
      return result.toJSON();
    }
  }

  module.exports = UserController;