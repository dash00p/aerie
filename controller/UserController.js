const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../model/UserModel');
const IxRight = require('../model/index/IndexRightModel');
const Right = require('../model/RightModel');

const UserController = {
  create: async user => {
    let response = { message: { text: "" } };
    let hash = await bcrypt.hash(user.sub_password, saltRounds);
    let result = await User.findOrCreate({
      where: {
        [Op.or]: [
          { username: user.sub_username },
          { email: user.sub_email }]
      },
      defaults: { username: user.sub_username, email: user.sub_email, password: hash, rank: 0 }
    });

    let isCreated = result[result.length - 1];
    if (!isCreated) {
      response.success = false;
      response.message.type = "danger"
      if (result[0].username.toLowerCase() == user.sub_username.toLowerCase())
        response.message.text += "Pseudo déjà utilisé";
      if (result[0].email.toLowerCase() == user.sub_email.toLowerCase()) {
        if (response.message.text.length > 0)
          response.message.text += ", ";
        response.message.text += "Adresse mail déjà utilisée";
      }
    }
    else {
      response.success = true;
      response.user = result[0];
      response.message.type = "success";
      response.message.text = "Compte créé avec succès !";
    }
    return response;

  },
  comparePassword: async (username, password) => {
    const user = await User.findOne({ where: { username: username } });

    return match = await bcrypt.compare(password, user.password);
  },
  find: async id => {
    user = await User.findById(id);
    return user;
  },
  getList: async () => {
    let users = await User.findAll();
    return users;
  },
  getRights: async id => {
    let tempRights = await Right.findAll({ where: { userId: id } });
    let rights = [];
    for (line of tempRights) {
      rights.push(line.toObject());
    }
    return rights;
  },
  addRights: async (id, rights) => {
    let rightsToInsert = rights.map(r => { return {userId:parseInt(id), ixRightId: r.id}});
    await Right.bulkCreate(rightsToInsert);

  },
  removeRights: async (id, rights) => {
    let IDsToRemove = rights.map(r => r.id);
    await Right.destroy({ where: { id: IDsToRemove, userId: id}});
  },
  getAllRights: async () => {
    let rights = await IxRight.findAll();
    return rights;
  }
}

module.exports = UserController;