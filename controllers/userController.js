const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator/check');
const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

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

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
  }

  try {
     User.findOne({ email: email })
      .then(user => {
        if (user) {
          return res.send({ message: 'User already registered.' });
        }
        bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              name: name,
              email: email,
              password: hashedPassword,
            });
            return user.save();
          }).then(result => {
            return res.send({ message: "user registered successfuly." })
          })
          .then(result => {
            return transporter.sendMail({
              to: email,
              from: process.env.NODEMAILER_SECRET_MAIL,
              subject: 'Signup succeeded!',
              html: `<h1>${name}! you successfully signed up in celebal..</h1>`
            });
          })
          .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      })
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }

};


exports.postLogin = (req, res, next) => {
  let id;
  let token;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        res.send({ message: 'invalid email or password....' });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            id = user._id
            token = jwt.sign({ id }, 'secret', {expiresIn: '10h'});
            //console.log(token);
            return res.send({ message: 'succesfully logged in....', token : token });
          }
            //console.log(token);
          return res.status(422).send({ message: 'invalid email or password....'  });
        })
        .catch(err => {
          console.log(err);
          res.status(422).send({ message: 'invalid email or password....' });
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      return res.send(users);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};