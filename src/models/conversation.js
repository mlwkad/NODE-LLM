import { pool } from '../config/db.js'

/**
 * 对话模型，处理与对话相关的数据库操作
 */
const ConversationModel = {
    /**
     * 创建新对话
     * @param {String} chatId - 对话ID
     * @param {String} userId - 用户ID
     * @returns {Object} - 创建的对话对象
     */
    async createConversation(chatId, userId) {
        try {
            // 插入对话数据
            await pool.query(
                'INSERT INTO conversations (chatId, content, own) VALUES (?, ?, ?)',
                [chatId, '[]', userId]
            )

            return { chatId, content: [], own: userId }
        } catch (error) {
            throw error
        }
    },

    /**
     * 删除对话
     * @param {String} chatId - 对话ID
     * @param {String} userId - 用户ID（确保只能删除自己的对话）
     * @returns {Boolean} - 删除是否成功
     */
    async deleteConversation(chatId, userId) {
        try {
            const [result] = await pool.query(
                'DELETE FROM conversations WHERE chatId = ? AND own = ?',
                [chatId, userId]
            )

            return result.affectedRows > 0
        } catch (error) {
            throw error
        }
    },

    /**
     * 根据对话ID获取对话内容
     * @param {String} chatId - 对话ID
     * @param {String} userId - 用户ID（确保只能获取自己的对话）
     * @returns {Object|null} - 对话对象或null（如果未找到）
     */
    async getConversationById(chatId, userId) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM conversations WHERE chatId = ? AND own = ?',
                [chatId, userId]
            )

            if (rows.length === 0) return null

            // 解析content字段
            const conversation = rows[0]
            conversation.content = JSON.parse(conversation.content || '[]')

            return conversation
        } catch (error) {
            throw error
        }
    },

    /**
     * 获取用户的所有对话
     * @param {String} userId - 用户ID
     * @returns {Array} - 对话对象数组
     */
    async getUserConversations(userId) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM conversations WHERE own = ? ORDER BY createdAt DESC',
                [userId]
            )

            // 解析每个对话的content字段
            return rows.map(conversation => {
                conversation.content = JSON.parse(conversation.content || '[]')
                return conversation
            })
        } catch (error) {
            throw error
        }
    },

    /**
     * 更新对话内容
     * @param {String} chatId - 对话ID
     * @param {String} userId - 用户ID（确保只能更新自己的对话）
     * @param {Object} message - 新消息对象，格式为 {role: String, content: String}
     * @returns {Boolean} - 更新是否成功
     */
    async addMessageToConversation(chatId, userId, message) {
        try {
            // 先获取当前对话内容
            const [rows] = await pool.query(
                'SELECT content FROM conversations WHERE chatId = ? AND own = ?',
                [chatId, userId]
            )

            if (rows.length === 0) return false

            // 解析当前内容并添加新消息
            const content = JSON.parse(rows[0].content || '[]')
            content.push(message)

            // 更新对话内容
            const [result] = await pool.query(
                'UPDATE conversations SET content = ? WHERE chatId = ? AND own = ?',
                [JSON.stringify(content), chatId, userId]
            )

            return result.affectedRows > 0
        } catch (error) {
            throw error
        }
    }
}

export default ConversationModel 