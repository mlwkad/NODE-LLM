import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

// JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here' // 生产环境应从环境变量获取

// JWT 配置
const JWT_OPTIONS = {
    algorithm: 'HS256', // 使用 HMAC SHA-256 算法
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'    // token 有效期24小时
}

/**
 * 生成JWT令牌
 * @param {Object} payload - 要编码到令牌中的数据
 * @returns {String} - JWT令牌
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, JWT_OPTIONS)
}

/**
 * 验证JWT令牌
 * @param {String} token - 要验证的JWT令牌
 * @returns {Object|null} - 解码后的令牌数据或null（如果验证失败）
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

/**
 * 哈希密码
 * @param {String} password - 要哈希的密码
 * @returns {String} - 哈希后的密码
 */
const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10)
}

/**
 * 验证密码
 * @param {String} password - 原始密码
 * @param {String} hash - 哈希后的密码
 * @returns {Boolean} - 密码是否匹配
 */
const verifyPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

/**
 * 生成随机用户ID
 * @returns {String} - 随机生成的用户ID
 */
const generateUserId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString()
}

export {
    generateToken,
    verifyToken,
    hashPassword,
    verifyPassword,
    generateUserId
} 