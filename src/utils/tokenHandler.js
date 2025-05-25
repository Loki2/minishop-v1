const jwt = require('jsonwebtoken');


//System User Auth Cookies
module.exports.createToken = (username, tokenVersion) => jwt.sign({ username, tokenVersion }, process.env.COOKIE_SECRET, { expiresIn: '1d' });

module.exports.sendToken = (res, token) => res.cookie(process.env.COOKIE_NAME, token, { httpOnly: true, secure: false, sameSite: "none" });