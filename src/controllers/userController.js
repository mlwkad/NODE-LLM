import UserModel from '../models/user.js'
import { generateToken, verifyPassword } from '../utils/auth.js'

/**
 * 用户控制器，处理与用户相关的请求
 */
const UserController = {
    /**
     * 用户注册
     * @param {Object} req - Express请求对象
     * @param {Object} res - Express响应对象
     */
    async register(req, res) {
        try {
            const { userName, password } = req.body

            // 验证请求数据
            if (!userName || !password) {
                return res.status(400).json({
                    success: false,
                    message: '用户名和密码不能为空'
                })
            }

            // 验证手机号格式（简单验证11位数字）
            if (!/^\d{11}$/.test(userName)) {
                return res.status(400).json({
                    success: false,
                    message: '用户名必须是11位手机号'
                })
            }

            // 检查用户名是否已存在
            const existingUser = await UserModel.findByUserName(userName)
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: '用户名已存在'
                })
            }

            // 创建新用户
            const user = await UserModel.createUser(userName, password)

            // 生成JWT令牌
            const token = generateToken({ userId: user.userId, userName: user.userName })

            // 返回成功响应
            res.status(201).json({
                success: true,
                message: '注册成功',
                data: {
                    userId: user.userId,
                    userName: user.userName,
                    token
                }
            })
        } catch (error) {
            console.error('注册错误:', error)
            res.status(500).json({
                success: false,
                message: '服务器错误，注册失败'
            })
        }
    },

    /**
     * 用户登录
     * @param {Object} req - Express请求对象
     * @param {Object} res - Express响应对象
     */
    async login(req, res) {
        try {
            const { userName, password } = req.body

            // 验证请求数据
            if (!userName || !password) {
                return res.status(400).json({
                    success: false,
                    message: '用户名和密码不能为空'
                })
            }

            // 查找用户
            const user = await UserModel.findByUserName(userName)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: '用户名或密码错误'
                })
            }

            // 验证密码
            const isPasswordValid = verifyPassword(password, user.passWord)
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: '用户名或密码错误'
                })
            }

            // 生成JWT令牌
            const token = generateToken({ userId: user.userId, userName: user.userName })

            // 返回成功响应
            res.status(200).json({
                success: true,
                message: '登录成功',
                data: {
                    userId: user.userId,
                    userName: user.userName,
                    token
                }
            })
        } catch (error) {
            console.error('登录错误:', error)
            res.status(500).json({
                success: false,
                message: '服务器错误，登录失败'
            })
        }
    },

    /**
     * 更新用户名
     * @param {Object} req - Express请求对象
     * @param {Object} res - Express响应对象
     */
    async updateUserName(req, res) {
        try {
            const { userId, newUserName } = req.body

            // 验证请求数据
            if (!userId || !newUserName) {
                return res.status(400).json({
                    success: false,
                    message: '用户ID和新用户名不能为空'
                })
            }

            // 检查用户是否存在
            const user = await UserModel.findByUserId(userId)
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: '用户不存在'
                })
            }

            // 检查新用户名是否已被使用
            const existingUser = await UserModel.findByUserName(newUserName)
            if (existingUser && existingUser.userId !== userId) {
                return res.status(409).json({
                    success: false,
                    message: '用户名已被使用'
                })
            }

            // 更新用户名
            const updated = await UserModel.updateUserName(userId, newUserName)

            if (!updated) {
                return res.status(500).json({
                    success: false,
                    message: '更新用户名失败'
                })
            }

            // 返回成功响应
            res.status(200).json({
                success: true,
                message: '用户名更新成功',
                data: {
                    userId,
                    userName: newUserName
                }
            })
        } catch (error) {
            console.error('更新用户名错误:', error)
            res.status(500).json({
                success: false,
                message: '服务器错误，更新用户名失败'
            })
        }
    }
}

export default UserController 