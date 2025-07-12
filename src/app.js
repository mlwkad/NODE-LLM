import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initDatabase } from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'

// 创建Express应用
const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(bodyParser.json())

// 初始化数据库
initDatabase()

// 路由
app.use('/api/users', userRoutes)
app.use('/api/conversations', conversationRoutes)

// 根路由
app.get('/', (req, res) => {
    res.json({
        message: '欢迎使用大模型聊天平台API',
        version: '1.0.0'
    })
})

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '请求的资源不存在'
    })
})

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err)
    res.status(500).json({
        success: false,
        message: '服务器内部错误'
    })
})

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`)
})

export default app 