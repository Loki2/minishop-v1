const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const createHttpError = require('http-errors');
const session = require('express-session');

const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const app = express();


//Initialization Middleware
app.use(morgan('dev'));
app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../', 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '../', 'temp'),
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 }
}))


//Init session
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: true,
//     httpOnly: true
//   }
// }));



mongoose.connect(`mongodb+srv://${db_username}:${db_password}@cluster0.gqt4a.mongodb.net/${db_name}?retryWrites=true&w=majority`);
// mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to database ...!')
});


app.get('/checker', (req, res) => {
  res.send('application is running healthy ...!')
});

const authRouter = require('./routes/auth.router');
const adminRouter = require('./routes/admin.router');



// Home Route
const homeRouter = require('./routes/home.router');
const productsRouter = require('./routes/products.router');
const ordersRouter = require('./routes/orders.router');
const blogsRouter = require('./routes/blogs.router');
const aboutRouter = require('./routes/about.router');
const contactRouter = require('./routes/contact.router');


app.use("/auth", authRouter)
app.use("/admin", adminRouter);

//Routes
app.use('/', homeRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/blogs', blogsRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);






//Handle Error
app.use((req, res, next) => {
  next(createHttpError.NotFound());
})

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.send(error);
})

module.exports = app;




