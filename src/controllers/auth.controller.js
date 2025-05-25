const bcrypt = require("bcryptjs");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//create user token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.APP_SECRET, {
    expiresIn: maxAge
  })
};

exports.get_login = async (req, res, next) => {
  res.render("login");
};

exports.post_login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    //Check empty fill
    if (!username || !password) {
      res.status(400).json({ message: 'Please Fill all require fields...!' })
    }

    //Query user from database
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Not found this username, Please signup, try again...!' })
    }

    //Compare Password
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      res.status(400).json({ message: 'Email or Passowrd incorrect...!' })
    }


    //Create Token
    const token = createToken(user._id);

    //Send Token to frontend
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.redirect('/admin');

  } catch (error) {
    next(error);
  }
};


exports.get_register = async (req, res, next) => {
  res.render("register", {
    title: "Create User",
  });
};



exports.get_logout = async (req, res, next) => {
  try {
    // const isUser = res.locals.user;

    // if(!isUser) return res.status(404).json({ message: 'not user to authenticated...!'})

    // const data = await client.query(`SELECT * FROM users WHERE username = $1`, [isUser.username]);

    // const user = data.rows;

    // console.log('loggedout user:', isUser)

    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};