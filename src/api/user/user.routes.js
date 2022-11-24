const UserRoutes = require('express').Router();
const upload = require('../../middlewares/file');
const { isAuth } = require('../../middlewares/auth.middlewares');

const {
  register,
  login,
  removeUser,
  patchUser,
  getUsers,
  getUser,
} = require('./user.controller');

UserRoutes.post('/register', upload.single('image'), register);
UserRoutes.post('/login', login);
UserRoutes.delete('/:id', removeUser);
UserRoutes.patch('/:id', upload.single('image'), [isAuth], patchUser);
UserRoutes.get('/', getUsers);
UserRoutes.get('/:id', getUser);

module.exports = UserRoutes;
