import express from 'express'
import ConversationController from '../controllers/conversationController.js'
import authenticate from '../middlewares/auth.js'

const router = express.Router()

/**
 * @route POST /api/conversations/create
 * @desc 创建新对话
 * @access Private
 * @params {userId, chatId}
 * @returns {chatId, content, own}
 */
router.post('/create', authenticate, ConversationController.createConversation)

/**
 * @route DELETE /api/conversations/delete
 * @desc 删除对话
 * @access Private
 * @params {userId, chatId}
 * @returns {success, message}
 */
router.delete('/delete', authenticate, ConversationController.deleteConversation)

/**
 * @route GET /api/conversations/get
 * @desc 获取对话内容
 * @access Private
 * @params {userId, chatId} (query)
 * @returns {chatId, content, own}
 */
router.get('/get', authenticate, ConversationController.getConversation)

/**
 * @route GET /api/conversations/list
 * @desc 获取用户所有对话
 * @access Private
 * @params {userId} (query)
 * @returns {Array<{chatId, content, own}>}
 */
router.get('/list', authenticate, ConversationController.getUserConversations)

/**
 * @route PUT /api/conversations/update
 * @desc 更新对话内容（添加新消息）
 * @access Private
 * @params {userId, chatId, message}
 * @returns {success, message}
 */
router.put('/update', authenticate, ConversationController.addMessageToConversation)

/**
 * @route POST /api/conversations/chat
 * @desc 与AI对话
 * @access Private
 * @params {message}
 * @returns {response}
 */
router.post('/chat', authenticate, ConversationController.chatWithAI)

export default router 