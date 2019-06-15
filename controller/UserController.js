const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const model = require('../model/UserModel');

const UserController = {
  create : async user => {
    let response = {message:{text:""}};
    let hash = await bcrypt.hash(user.sub_password, saltRounds);
    let result = await model.findOrCreate({
      where: {[Op.or]: [
      { username: user.sub_username },
      { email: user.sub_email }]},
      defaults: { username : user.sub_username, email : user.sub_email, password : hash, rank: 20 }});

    let isCreated =  result[result.length-1];
    if(!isCreated){
      response.success = false;
      response.message.type = "danger"
      if(result[0].username.toLowerCase() == user.sub_username.toLowerCase())
        response.message.text += "Pseudo déjà utilisé";
      if(result[0].email.toLowerCase() == user.sub_email.toLowerCase()){
        if(response.message.text.length > 0)
          response.message.text += ", ";
        response.message.text += "Adresse mail déjà utilisée";
      }
    }
    else{
      response.success = true;
      response.user = result[0];
      response.message.type = "success";
      response.message.text = "Compte créé avec succès !";
    }
    return response;

  },
  comparePassword : async (username, password) => {
    const user = await model.findOne({ where: {username: username}});

    return match = await bcrypt.compare(password, user.password);
  },
  find : async id => {
    user = await model.findById(id);
    return user;
  },
  getList : async () => {
    let users =  await model.findAll();
    return users;
  }
}

module.exports = UserController;