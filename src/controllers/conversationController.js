import ConversationModel from '../models/conversation.js'
import UserModel from '../models/user.js'

/**
 * 对话控制器，处理与对话相关的请求
 */
const ConversationController = {
    /**
     * 创建新对话
     * @param {Object} req - Express请求对象
     * @param {Object} res - Express响应对象
     */
    async createConversation(req, res) {
        try {
            const { userId, chatId } = req.body

            // 验证请求数据
            if (!userId || !chatId) {
                return res.status(400).json({
                    success: false,
                    message: '用户ID和对话ID不能为空'
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

            // 检查对话ID是否已存在
            const existingConversation = await ConversationModel.getConversationById(chatId, userId)
            if (existingConversation) {
                return res.status(409).json({
                    success: false,
                    message: '对话ID已存在'
                })
            }

            // 创建新对话
            const conversation = await ConversationModel.createConversation(chatId, userId)

            // 将对话ID添加到用户的chatIds中
            await UserModel.addChatId(userId, chatId)

            // 返回成功响应
            res.status(201).json({
                success: true,
                message: '对话创建成功',
                data: conversation
            })
        } catch (error) {
            console.error('创建对话错误:', error)
            res.status(500).json({
                success: false,
                message: '服务器错误，创建对话失败'
            })
        }
    },

    /**
     * 删除对话
     * @param {Object} req - Express请求对象
     * @param {Object} res - Express响应对象
     */
    async deleteConversation(req, res) {
        try {
            const { userId, chatId } = req.body

            // 验证请求数据
            if (!userId || !chatId) {
                return res.status(400).json({
                    success: false,
                    message: '用户ID和对话ID不能为空'
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

            // 检查对话是否存在
            const conversation = await ConversationModel.getConversationById(chatId, userId)
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: '对话不存在或不属于该用户'
                })
            }

            // 删除对话
            const deleted = await ConversationModel.deleteConversation(chatId, userId)

            // 从用户的chatIds中移除对话ID
            await UserModel.removeChatId(userId, chatId)

            // 返回成功响应
            res.status(200).json({
                success: true,
                message: '对话删除成功'
            })
        } catch (error) {
            console.error('删除对话错误:', error)
            res.status(500).json({
                success: false,
                message: '服务器错误，删除对话失败'
            })
        }
    },

    /**
     * 获取对话内容
     * @param {Object} req - Express请求对象
     * @param {Object} res - Express响应对象
     */
    async getConversation(req, res) {
        try {
            const { userId, chatId } = req.query

            // 验证请求数据
            if (!userId || !chatId) {
                return res.status(400).json({
                    success: false,
                    message: '用户ID和对话ID不能为空'
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

            // 获取对话内容
            const conversation = await ConversationModel.getConversationById(chatId, userId)

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: '对话不存在或不属于该用户'
                })
            }

            // 返回成功响应
            res.status(200).json({
                success: true,
                data: conversation
            })
        } catch (error) {
            console.error('获取对话内容错误:', error)
            res.status(500).json({
                success: false,
                message: '服务器错误，获取对话内容失败'
            })
        }
    },

    /**
     * 获取用户所有对话
     * @param {Object} req - Express请求对象
     * @param {Object} res - Express响应对象
     */
    async getUserConversations(req, res) {
        try {
            const { userId } = req.query

            // 验证请求数据
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: '用户ID不能为空'
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

            // 获取用户所有对话
            const conversations = await ConversationModel.getUserConversations(userId)

            // 返回成功响应
            res.status(200).json({
                success: true,
                data: conversations
            })
        } catch (error) {
            console.error('获取用户对话列表错误:', error)
            res.status(500).json({
                success: false,
                message: '服务器错误，获取用户对话列表失败'
            })
        }
    },

    /**
     * 更新对话内容（添加新消息）
     * @param {Object} req - Express请求对象
     * @param {Object} res - Express响应对象
     */
    async addMessageToConversation(req, res) {
        try {
            const { userId, chatId, message } = req.body

            // 验证请求数据
            if (!userId || !chatId || !message) {
                return res.status(400).json({
                    success: false,
                    message: '用户ID、对话ID和消息内容不能为空'
                })
            }

            // 验证消息格式
            if (!message.role || !message.content) {
                return res.status(400).json({
                    success: false,
                    message: '消息格式不正确，必须包含role和content字段'
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

            // 检查对话是否存在
            const conversation = await ConversationModel.getConversationById(chatId, userId)
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: '对话不存在或不属于该用户'
                })
            }

            // 添加消息到对话
            const updated = await ConversationModel.addMessageToConversation(chatId, userId, message)

            if (!updated) {
                return res.status(500).json({
                    success: false,
                    message: '更新对话内容失败'
                })
            }

            // 返回成功响应
            res.status(200).json({
                success: true,
                message: '对话内容更新成功'
            })
        } catch (error) {
            console.error('更新对话内容错误:', error)
            res.status(500).json({
                success: false,
                message: '服务器错误，更新对话内容失败'
            })
        }
    },

    /**
     * 对话接口（与AI模型对话）
     * @param {Object} req - Express请求对象
     * @param {Object} res - Express响应对象
     */
    async chatWithAI(req, res) {
        try {
            const { message } = req.body

            // 验证请求数据
            if (!message) {
                return res.status(400).json({
                    success: false,
                    message: '消息内容不能为空'
                })
            }

            // 暂时返回固定响应，等待后续实现
            res.status(200).json({
                success: true,
                message: '此接口暂未实现，等待讯飞星火API集成',
                data: {
                    response: '这是一个模拟的AI回复，实际功能将在后续实现。'
                }
            })
        } catch (error) {
            console.error('AI对话错误:', error)
            res.status(500).json({
                success: false,
                message: '服务器错误，AI对话失败'
            })
        }
    }
}

export default ConversationController 