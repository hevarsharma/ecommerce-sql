const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv= require('dotenv');

const errorController = require('./controllers/errorController');

const MONGODB_URI =
  'mongodb://localhost/ecommerce-application';

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use((req, res, next) => {
//     res.send({message : 'we working on ecommerce application......'});
// });

const userRoutes = require('./routes/userRouter');
const adminRoutes = require('./routes/adminRouter');
const productRoutes = require('./routes/productRouter');
const orderRoutes = require('./routes/orderRouter');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/ecommerce', userRoutes)
app.use('/ecommerce/admin', adminRoutes)
app.use('/ecommerce/products', productRoutes)
app.use('/ecommerce/orders', orderRoutes)

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).send(error);
});

dotenv.config();

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true }  )
  .then(result => {
    app.listen(process.env.PORT);
    console.log(`server connected on port ${process.env.PORT}....`);
  })
  .catch(err => {
    console.log(err);
  });
