/**
 * AI聊天工具，用于与讯飞星火API交互
 * 这是一个占位文件，实际实现将在项目搭建完成后添加
 */

/**
 * 与AI模型对话
 * @param {String} message - 用户消息
 * @returns {Promise<String>} - AI回复
 */
const chatWithAI = async (message) => {
    // 这里将来会实现与讯飞星火API的交互
    return '这是一个模拟的AI回复，实际功能将在后续实现。'
}

/**
 * 流式返回AI回复
 * @param {String} message - 用户消息
 * @param {Function} callback - 用于处理流式返回的回调函数
 */
const streamChatWithAI = async (message, callback) => {
    // 这里将来会实现与讯飞星火API的流式交互
    const mockResponse = '这是一个模拟的AI流式回复，实际功能将在后续实现。'

    // 模拟流式返回
    for (let i = 0; i < mockResponse.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        callback(mockResponse[i])
    }

    // 结束流
    callback(null)
}

export {
    chatWithAI,
    streamChatWithAI
} 