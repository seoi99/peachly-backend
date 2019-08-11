require('dotenv').config({ path: './test.env' })
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./UserModel');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;


var app = express();
//Using body-parser middleware

//Parse application/x-www-form-urlencoded body from POST
app.use(bodyParser.urlencoded({
    extended: true
  }));

//Parse application/json body from POST
app.use(bodyParser.json());


app.post('/user/createUser', function(req, res){
          var email = req.body.email;
          var password = req.body.password;
          console.log(email,password);
          User.addUser(email, password, function(addSuccess, errMsg){
              if (!addSuccess)
                  return res.status(400).send({message: errMsg });
              else {
                  var token = jwt.sign(
                      {id: email},
                      JWT_SECRET, {
                      expiresIn: '24h',
                      });
                  return res.status(200).send({token});
              }
          });
});

//TODO
app.post('/user/login', function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  User.login(email, password, function(sucesss, err) {
      if (!sucesss) {
        return res.status(403).send({message: err})
      } else {
        var token = jwt.sign(
            {id: email},
            JWT_SECRET, {
            expiresIn: '24h',
            });
        return res.status(200).send({token})
      }
  })
});

//TODO
app.put('/user/addSecret', function(req, res){
  var secret = req.body.secret;
  var token = req.body.token;
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        console.log(err);
        return res.status(403).send(err);
      } else {
        User.addSecret(decoded.id, secret);
        return res.status(200).send(decoded)
    }
  });
});

//TODO
app.get('/user/guessSecret', function(req, res){
  var email = req.body.email;
  var secret = req.body.secret;
  User.guessSecret(email, secret, function(success, msg) {
    if (success) {
      return res.status(200).send(success)
    } else {
      if (msg === "not matched") {
        return res.status(200).send(success)
      }
      return res.status(404).send({message: msg})
    }
  })
});


var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});
