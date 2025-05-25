// const {roles} = require('../Utils/constants');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.APP_SECRET, async (error, decodedToken) => {
      if (error) {
        // res.status(401)
        console.log(error.message)
        res.redirect('/auth/login')
      } else {
        let user = await User.findById(decodedToken.id);
        // console.log("currently user:", user)
        res.locals.user = user;
        next();
      }
    })
  } else {
    res.redirect('/auth/login');
  }
}

//user Roles
function authRoles(roles) {
  return (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.APP_SECRET, async (error, decodedToken) => {
        if (error) {
          console.log(error.message);
          res.locals.user === null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          // console.log("user role login:", user)
          if (user.role != roles) {
            res.status(401);
            res.redirect('/auth/login');
          }
          next();
        }
      })
    }
  }
}


module.exports = {
  authenticated,
  // checkUser,
  authRoles
}
