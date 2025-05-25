const User = require("../models/user");
const mkdirp = require("mkdirp");
const {
  validateUsername,
  validateEmail,
  validatePassword,
} = require("../utils/isValidate");
const bcrypt = require("bcryptjs");


exports.get_users = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    res.render('admin/users/index', {
      users: users
    })
  } catch (error) {
    next(error);
  }
}

exports.get_addUser = async (req, res, next) => {
  try {
    res.render('admin/users/create')
  } catch (error) {
    next(error)
  }
}

exports.post_addUser = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    //Check if empty fill
    if (!username || !email || !password || !confirmPassword) {
      res.status(400).json({ message: "Please Fill all require fields...!" });
    }

    // console.log("user data", req.body);

    //Validation Username
    const isValidUsername = validateUsername(username);
    if (!isValidUsername) {
      res.status(400).json({
        message: "Please Enter a Username between 3 to 20 characters...",
      });
    }

    //Validation Email
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      res.status(400).json({ message: 'Please Enter Valid Email' });
    }

    //Validate Password
    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      res.status(400).json({ message: 'Please must be leatst at 6 to 60 charecters' })
    }

    //check matched password
    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Password do not match...!' })
    }

    //Check exist username
    const isUsername = await User.findOne({ username });
    if (isUsername) {
      res.status(400).json({ error: 'Username already in used...' })
    }

    //Check Existing Email
    const isEmail = await User.findOne({ email });
    if (isEmail) {
      res.status(400).json({ error: 'Email already in used...' })
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.redirect('/admin/users');

  } catch (error) {
    next(error)
  }
}

//Loggedin User change their password
exports.get_changePassword = async (req, res, next) => {
  try {
    const user = res.locals.user;

    console.log("user locals:", user)

    res.render("admin/users/change-password", {
      id: user._id,
    })
  } catch (error) {
    next(error);
  }
}


exports.post_changePassword = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const { password, confirmPassword } = req.body;

    //Validate Password
    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      res.status(400).json({ message: 'Please must be latest at 6 to 60 characters' })
    }

    //check matched password
    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Password do not match...!' })
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate({ _id: user._id }, {
      password: hashedPassword
    });

    res.redirect('/auth/signin')
  } catch (error) {
    next(error)
  }
}



//Loggedin User Profile
exports.get_myInform = async (req, res, next) => {
  try {
    const user = res.locals.user;

    // console.log("logged in user:", user)

    res.render('admin/users/myInfo', {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      gender: user.gender,
      dob: user.dob,
      bio: user.bio,
      contact: user.contact,
      phone: user.phone,
      address: user.address,
      position: user.position,
      city: user.city,
      province: user.province,
      country: user.country,
      username: user.username,
      email: user.email,
      image: user.image,
      cover: user.cover,
      joined: user.createdAt
    });
  } catch (error) {
    next(error)
  }
}

//Update information
exports.update_myInform = async (req, res, next) => {
  try {
    const { id } = req.params;
    const imageFile = typeof req.files.profileImage !== 'undefined' ? req.files.profileImage.name : "";
    const { firstname, lastname, email, contact, phone, dob, position, bio, address, city, province, country } = req.body;

    const result = await User.update({ _id: id }, {
      firstname: firstname,
      lastname: lastname,
      email: email,
      contact: contact,
      phone: phone,
      dob: dob,
      position: position,
      bio: bio,
      address: address,
      city: city,
      province: province,
      country: country,
      image: imageFile
    });

    if (result) {
      mkdirp.sync('./public/uploads/images/profiles/' + id);

      if (imageFile != "") {
        const profImage = req.files.profileImage;
        const path = './public/uploads/images/profiles/' + id + '/' + imageFile;

        profImage.mv(path, function (error) {
          return console.log(error)
        })
      }

    }

    res.redirect('/admin/users/profile')
  } catch (error) {
    next(error)
  }
}

//Admin browser user profile
exports.get_profile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    // console.log("user information:", user)

    res.render('admin/users/profile', {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      dob: user.dob,
      bio: user.bio,
      contact: user.contact,
      phone: user.phone,
      address: user.address,
      position: user.position,
      city: user.city,
      province: user.province,
      country: user.country,
      username: user.username,
      email: user.email,
      image: user.image,
      cover: user.cover,
      joined: user.createdAt
    });
  } catch (error) {
    next(error)
  }
}

exports.get_resetPassowrd = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    // console.log('user:', user)

    res.render('admin/users/reset-password', {
      id: user._id
    });
  } catch (error) {
    next(error)
  }
}

exports.post_resetPassowrd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;

    //Validate Password
    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      res.status(400).json({ message: 'Please must be leatst at 6 to 60 charecters' })
    }

    //check matched password
    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Password do not match...!' })
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.update({ _id: id }, {
      password: hashedPassword
    });

    res.redirect('/admin/users')

  } catch (error) {
    next(error);
  }
}

exports.get_updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    res.render('admin/users/permission', {
      id: user._id,
      role: user.role
    })
  } catch (error) {
    next(error)
  }
}

exports.post_updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = req.body.role;

    await User.update({ _id: id }, {
      role: role
    });

    res.redirect('/admin/users')
  } catch (error) {
    next(error);
  }
}