import express from 'express'
import UserController from '../controllers/userController.js'
import authenticate from '../middlewares/auth.js'

const router = express.Router()

/**
 * @route POST /api/users/register
 * @desc 用户注册
 * @access Public
 * @params {userName, password}
 * @returns {userId, userName, token}
 */
router.post('/register', UserController.register)

/**
 * @route POST /api/users/login
 * @desc 用户登录
 * @access Public
 * @params {userName, password}
 * @returns {userId, userName, token}
 */
router.post('/login', UserController.login)

/**
 * @route PUT /api/users/update-username
 * @desc 更新用户名
 * @access Private
 * @params {userId, newUserName}
 * @returns {userId, userName}
 */
router.put('/update-username', authenticate, UserController.updateUserName)

export default router 