var validator  = require('validator')

var UserModel = {};

var users = {};

// Adds a user with email and password, and passes success/failure to callback
UserModel.addUser = function(email, password, callback){
    if(!email || !validator.isEmail(email)){
        callback(false, "Email is ill-formed");
    }
    else if(email in users){
        console.log(email, users);
        callback(false, "Email already exists");
    }
    else if(!password){
        callback(false, "Password is ill-formed");
    }
    else{
        users[email] = { password };
        callback(true);
    }
};

UserModel.login = function(email, password, callback) {
  if (email in users) {
    console.log(users[email].password, password);
    if (users[email].password === password) {
        return callback(true, "authenticated")
    }
  }
  callback(false, "invalid credentials")
}

UserModel.addSecret = function(email, secret) {
  users[email].secret = secret;
  console.log('secret',email, secret);
}

UserModel.guessSecret = function(email, secret, callback) {
  if (email in users && users[email].secret) {
      users[email].secret === secret ? callback(true, "matched") : callback(false, "not matched")
  } else {
    callback(false, "not found")
  }
}
module.exports = UserModel;
