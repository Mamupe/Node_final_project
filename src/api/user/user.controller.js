const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./user.model');
const { setError } = require('../../helpers/error/handle.error');
const { deleteFile } = require('../../middlewares/delete-file');

const register = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    if (req.file) {
      newUser.image = req.file.path;
    }
    const userDuplicate = await User.findOne({ username: newUser.username });

    if (userDuplicate) return next('User already exists');

    const newUserDB = newUser.save();
    return res.json({
      status: 201,
      message: 'user registered',
      data: newUserDB,
    });
  } catch (error) {
    return next(setError(500, 'User registered fail'));
  }
};

const login = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({ username: req.body.username });
    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
      userInfo.password = null;
      const token = jwt.sign(
        {
          id: userInfo._id,
          username: userInfo.username,
        },
        req.app.get('secretKey'),
        { expiresIn: '1h' },
      );
      return res.json({
        status: 200,
        message: 'welcome User',
        user: userInfo,
        token: token,
      });
    } else {
      return next('Incorrect password');
    }
  } catch (error) {
    return next(setError(500, 'User login fail'));
  }
};

const patchUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patchUserDB = new User(req.body);

    patchUserDB._id = id;
    const userDB = await User.findByIdAndUpdate(id, patchUserDB);

    if (req.file) {
      deleteFile(userDB.image);
      patchUserDB.image = req.file.path;
    }

    if (!userDB) {
      return next('User not found');
    }
    return res.status(200).json({
      new: userDB,
      old: userDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in user update'));
  }
};

const removeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser.image) {
      deleteFile(deletedUser.image);
    }
    if (!deletedUser) {
      return next(setError(404, 'User not found'));
    }
    return res.status(200).json({
      message: 'User deleted',
      deletedUser,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in User deletion'));
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json({
      status: 200,
      message: 'Recovered all Users',
      data: { users },
    });
  } catch (error) {
    return next(setError(500, 'Fail to recover users'));
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, removeUser, patchUser, getUsers, getUser };
