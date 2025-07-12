import { verifyToken } from '../utils/auth.js'

/**
 * 身份验证中间件
 * 验证请求头中的JWT令牌
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const authenticate = (req, res, next) => {
    // 从请求头中获取Authorization头
    const authHeader = req.headers['authorization']

    // 检查Authorization头是否存在
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: '未提供认证令牌'
        })
    }

    // 从Authorization头中提取令牌（Bearer token格式）
    const token = authHeader.split(' ')[1]

    // 验证令牌
    const decoded = verifyToken(token)

    // 如果令牌无效
    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: '无效或过期的令牌'
        })
    }

    // 将解码后的用户信息添加到请求对象
    req.user = decoded

    // 继续处理请求
    next()
}

export default authenticate 