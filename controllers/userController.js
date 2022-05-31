const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator/check');
const dotenv = require('dotenv');

const mySqlConnection = require('../config/dbConfig');

const jwt = require('jsonwebtoken');

dotenv.config();

const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_SECRET_MAIL,
      pass: process.env.NODEMAILER_SECRET_KEY
    },
    tls: {
      rejectUnauthorized: false
    }
  }
);

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const errors = validationResult(req);

  //encrypt passwords....
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  if (!errors.isEmpty()) {
    console.log(errors.array());
  }

  const user = {
    email: email,
    password: encryptedPassword,
    name: name,
    created_At: new Date(),
    updated_At: new Date()
  };

  try {

    mySqlConnection.query("SELECT EMAIL FROM Users WHERE EMAIL = '" + email + "'", function (err, result, field) {
      if (result.length !== 0) {
        //console.log(result);
        res.send({ message: "User is already registered" });

      }
      else {

        let sql = 'INSERT INTO users SET ?';
        mySqlConnection.query(sql, user, function (err, result, field) {    //sql, user, (err, rows, fields)
          if (!err) {
            res.send({ 
              "code": 200,
              message: "User is registered" });
            
              transporter.sendMail({
                to: email,
                from: process.env.NODEMAILER_SECRET_MAIL,
                subject: 'Signup succeeded!',
                html: `<h1>${name}! you successfully signed up in celebal..</h1>`
              });
            
          }
          else {
            res.send({ 
              "code": 204,
              errrrror: err });
          }
        });

      }

    })
  }
  catch (err) {
    res.send({ ee: err });
  }

};


exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }

  //compare password
  mySqlConnection.query("SELECT * FROM users WHERE EMAIL = '" + email + "'", async (err, result, field) => {
    try {
      if (err) {
        res.send({ message: err });
      }
      else {
        comparePassword = await bcrypt.compare(password, result[0].password);
        let id = result[0].id;

        if (comparePassword) {
          let payload = { id };
          let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "10h" });
          console.log(token);
          res.send({
            "code": 200,
            "success": "login sucessfull"
          })
        }
        else {
          res.send({
            "code": 204,
            "success": "Email and password does not match"
          })
        }

      }
    }
    catch (er) {
      res.send({ er: er });
    }
  });

};

exports.getUsers = (req, res, next) => {

  mySqlConnection.query("SELECT * FROM users", async (err, result, field) => {
    try {
      if (!err) {
        res.send({
          "code": 200,
          users: result
        });
      }
      else {
        res.send({
          "code": 204,
          err: err
        });
      }
    } catch (er) {
      res.send({
        "code": 204,
        er: er
      });
    }
  });

};