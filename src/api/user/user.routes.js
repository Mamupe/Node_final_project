const UserRoutes = require('express').Router();
const upload = require('../../middlewares/file');
const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         favouriteBands:
 *           type: string
 *         role:
 *           type: string
 *         image:
 *           type: string
 *       required:
 *         - username
 *         - password
 *         - role
 *         - image
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     userlog:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *       required:
 *         - username
 *         - password
 *         - role
 */

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
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [users]
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 */

UserRoutes.post('/register', upload.single('image'), register);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log a new user
 *     tags: [users]
 *     description: Log a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/userlog"
 *     responses:
 *       200:
 *         description: succes
 */
UserRoutes.post('/login', login);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: delete a user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: delete a user
 *     responses:
 *       200:
 *         description: Success
 *
 */
UserRoutes.delete('/:id', [isAdmin], removeUser);
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: edit a user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: edit a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 *     responses:
 *       200:
 *         description: Success
 *
 */
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
