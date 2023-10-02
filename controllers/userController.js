const { Users } = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { messages } = require('../utility/messages');
const { AppError } = require('../utility/appError');

const signToken = (id, email, role) => {
  return jwt.sign(
    { id: id, email: email, role: role },
    process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
}

//SignUp API
const SignUp = async (req, res, next) => {

  try {
    const { name, email, password, role } = req.body;

    if (name == "string" || email == "string" || password == "string" || role == "string") {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_user
      });
    }
    let user = new Users({
      name,
      email,
      password,
      role
    });

    user
      .save()
      .then(() => {
        return res.status(201).json({
          status: "success",
          requestAt: req.requestTime,
          data: {
            newUser: {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role
            },
          },
          message: messages.user_registered_successfully
        });
      })
      .catch(err => {
        return next(new AppError(err, 400));
      });

  } catch (err) {
    return next(new AppError(err, 400));
  }
};

//SignIn API
const SignIn = async (req, res, next) => {

  try {
    const { email, password } = req.body;

    if (email == "string" || password == "string") {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_user
      });
    }

    //1) Check email and password exists.
    if (!email) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.provide_email,
      });
    }

    if (!password) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.provide_password,
      });
    }

    //2) Check if user exist
    const ValidUser = await Users.findOne({ email: email });
    if (ValidUser) {
      var SignInUser = await Users.findOne({ email: email }).select('+password');
    }
    else {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.invalid_email
      });
    }

    //3) check user is active or deactive
    if (!ValidUser.is_active) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.user_is_not_active
      });
    }

    //4) password is correct
    const CorrectPassword = await ValidUser.ValidatePassword(
      password,
      SignInUser.password
    );
    if (CorrectPassword) {
      const token = signToken(SignInUser._id, SignInUser.email, SignInUser.role);
      res.status(200).json({
        status: 'Success',
        requestAt: req.requestTime,
        token: `Bearer ${token}`,
        message: messages.user_login_successfully
      });
    }
    else {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.invalid_password
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }


};

//GetCurrentUser API , Authenticated with Passport JS
const getCurrentUser = async (req, res, next) => {

  try {
    const id = req.user._id
    let currentUser = await Users.findById(id)
    return res.status(200).send({
      status: "success",
      requestAt: req.requestTime,
      user: currentUser,
      message: messages.user_get_successfully,
    });
  } catch (err) {
    return next(new AppError(err, 400));
  }

};

//UpdateCurrentUserProfile API , Authenticated with Passport JS
const updateCurrentUserProfile = async (req, res, next) => {

  try {
    const id = req.user._id

    let { name, password } = req.body;

    if (name == "string" || password == "string") {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_user
      });
    }

    if (password) {
      password = await bcrypt.hash(password, 12);
    }

    let updatedata = {
      name,
      password
    }

    let updatedUser = await Users.findByIdAndUpdate(id, updatedata, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.user_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).json({
        status: "Success",
        requestAt: req.requestTime,
        message: messages.user_update_successfully,
        updatedUser: updatedUser,
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }

};


module.exports = {
  SignUp,
  SignIn,
  getCurrentUser,
  updateCurrentUserProfile
}