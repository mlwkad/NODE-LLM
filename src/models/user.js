import { pool } from '../config/db.js'
import { hashPassword, generateUserId } from '../utils/auth.js'

/**
 * 用户模型，处理与用户相关的数据库操作
 */
const UserModel = {
    /**
     * 创建新用户
     * @param {String} userName - 用户名
     * @param {String} password - 密码（未哈希）
     * @returns {Object} - 包含用户ID和用户名的对象
     */
    async createUser(userName, password) {
        try {
            // 生成随机用户ID
            const userId = generateUserId()

            // 哈希密码
            const hashedPassword = hashPassword(password)

            // 插入用户数据
            const [result] = await pool.query(
                'INSERT INTO users (userId, userName, passWord, chatIds) VALUES (?, ?, ?, ?)',
                [userId, userName, hashedPassword, '[]']
            )

            return { userId, userName }
        } catch (error) {
            throw error
        }
    },

    /**
     * 根据用户名查找用户
     * @param {String} userName - 要查找的用户名
     * @returns {Object|null} - 用户对象或null（如果未找到）
     */
    async findByUserName(userName) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE userName = ?',
                [userName]
            )

            return rows.length > 0 ? rows[0] : null
        } catch (error) {
            throw error
        }
    },

    /**
     * 根据用户ID查找用户
     * @param {String} userId - 要查找的用户ID
     * @returns {Object|null} - 用户对象或null（如果未找到）
     */
    async findByUserId(userId) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE userId = ?',
                [userId]
            )

            return rows.length > 0 ? rows[0] : null
        } catch (error) {
            throw error
        }
    },

    /**
     * 更新用户名
     * @param {String} userId - 用户ID
     * @param {String} newUserName - 新用户名
     * @returns {Boolean} - 更新是否成功
     */
    async updateUserName(userId, newUserName) {
        try {
            const [result] = await pool.query(
                'UPDATE users SET userName = ? WHERE userId = ?',
                [newUserName, userId]
            )

            return result.affectedRows > 0
        } catch (error) {
            throw error
        }
    },

    /**
     * 添加聊天ID到用户的chatIds数组
     * @param {String} userId - 用户ID
     * @param {String} chatId - 要添加的聊天ID
     * @returns {Boolean} - 更新是否成功
     */
    async addChatId(userId, chatId) {
        try {
            // 先获取当前chatIds
            const [rows] = await pool.query(
                'SELECT chatIds FROM users WHERE userId = ?',
                [userId]
            )

            if (rows.length === 0) return false

            // 解析当前chatIds并添加新的chatId
            const chatIds = JSON.parse(rows[0].chatIds || '[]')
            chatIds.push(chatId)

            // 更新用户的chatIds
            const [result] = await pool.query(
                'UPDATE users SET chatIds = ? WHERE userId = ?',
                [JSON.stringify(chatIds), userId]
            )

            return result.affectedRows > 0
        } catch (error) {
            throw error
        }
    },

    /**
     * 从用户的chatIds数组中移除聊天ID
     * @param {String} userId - 用户ID
     * @param {String} chatId - 要移除的聊天ID
     * @returns {Boolean} - 更新是否成功
     */
    async removeChatId(userId, chatId) {
        try {
            // 先获取当前chatIds
            const [rows] = await pool.query(
                'SELECT chatIds FROM users WHERE userId = ?',
                [userId]
            )

            if (rows.length === 0) return false

            // 解析当前chatIds并移除指定的chatId
            const chatIds = JSON.parse(rows[0].chatIds || '[]')
            const updatedChatIds = chatIds.filter(id => id !== chatId)

            // 更新用户的chatIds
            const [result] = await pool.query(
                'UPDATE users SET chatIds = ? WHERE userId = ?',
                [JSON.stringify(updatedChatIds), userId]
            )

            return result.affectedRows > 0
        } catch (error) {
            throw error
        }
    },

    /**
     * 获取用户的所有聊天ID
     * @param {String} userId - 用户ID
     * @returns {Array} - 聊天ID数组
     */
    async getChatIds(userId) {
        try {
            const [rows] = await pool.query(
                'SELECT chatIds FROM users WHERE userId = ?',
                [userId]
            )

            if (rows.length === 0) return []

            return JSON.parse(rows[0].chatIds || '[]')
        } catch (error) {
            throw error
        }
    }
}

export default UserModel 