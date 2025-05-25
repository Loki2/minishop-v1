const express = require("express");
const {
  post_addUser,
} = require("../controllers/user.controller");

const { get_login, post_login, get_register, get_logout } = require("../controllers/auth.controller");


const router = express.Router();


router.get("/login", get_login);
router.post("/login", post_login);



router.get("/register", get_register);
router.post("/register", post_addUser);


router.get("/logout", get_logout);




module.exports = router;