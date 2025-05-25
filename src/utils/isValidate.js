//Validate Username function
module.exports.validateUsername = (username) => {
  const fmtUsername = username.trim()

  return fmtUsername.length >= 3 && fmtUsername.length <= 20
}

//Validate email function
module.exports.validateEmail = (email) => {
  const fmtEmail = email.trim().toLocaleLowerCase()
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

  return emailRegex.test(fmtEmail)
}

//Validate Password function
module.exports.validatePassword = (password) => password.length >= 6 && password.length <= 75