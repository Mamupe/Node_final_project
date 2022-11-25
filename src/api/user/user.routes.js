const UserRoutes = require('express').Router();
const upload = require('../../middlewares/file');
const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');

const {
  register,
  login,
  removeUser,
  patchUser,
  getUsers,
  getUser,
} = require('./user.controller');

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [users]
 *     description: Lets a user post a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - image
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               favouriteBands:
 *                 type: string
 *               role:
 *                 type: string
 *               image:
 *                 type: string
 */

UserRoutes.post('/register', upload.single('image'), register);
UserRoutes.post('/login', login);
UserRoutes.delete('/:id', [isAdmin], removeUser);
UserRoutes.patch('/:id', upload.single('image'), [isAuth], patchUser);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: return users
 *     tags: [users]
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Success
 *
 */
UserRoutes.get('/', getUsers);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: return a user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: Get a user
 *     responses:
 *       200:
 *         description: Success
 *
 */
UserRoutes.get('/:id', getUser);

module.exports = UserRoutes;
