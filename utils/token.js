import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cors from 'cors'

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10), // 预加密的密码
    role: 'admin'
  }
]

const app = express()
const PORT = 3001
const JWT_SECRET = 'your-secret-key-here' // 生产环境应从环境变量获取

// JWT 配置
const JWT_OPTIONS = {
  algorithm: 'HS256', // 使用 HMAC SHA-256 算法
  expiresIn: '1h'    // token 有效期1小时
} 

const REFRESH_TOKEN_OPTIONS = {
  algorithm: 'HS256', // 使用相同的算法
  expiresIn: '7d'    // refresh token 有效期7天
} 

app.use(cors())
app.use(bodyParser.json())

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  // 查找用户
  const user = users.find(u => u.username === username)
  if (!user) return res.status(401).json({ message: '用户名或密码错误' })
  // 验证密码
  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash)
  if (!isPasswordValid) return res.status(401).json({ message: '用户名或密码错误' })

  // 生成 JWT Token(普通令牌): 前端存储
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    JWT_OPTIONS
  )

  // 生成 Refresh Token(刷新令牌): 只用来刷新普通令牌有效期, 必须存储在数据库中(这块的逻辑还没做)
  // 意义: 让权限高的令牌时效低, 用来给这些令牌续期
  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    REFRESH_TOKEN_OPTIONS
  )

  res.json({ token, refreshToken })
})

// 刷新 Token 接口
app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body
  try {
    // 验证 Refresh Token
    const decoded = jwt.verify(refreshToken, JWT_SECRET, { algorithms: ['HS256'] }) 
    const user = users.find(u => u.id === decoded.userId)
    if (!user) return res.status(401).json({ message: '无效的 Refresh Token' })

    // 生成新的 Access Token
    const newToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      JWT_OPTIONS
    )

    res.json({ token: newToken })
  } catch (error) {
    res.status(401).json({ message: 'Refresh Token 已过期，请重新登录' })
  }
})

// 需要验证token的接口
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === (req).user.userId)
  if (!user) return res.status(404).json({ message: '用户不存在' })

  res.json({ id: user.id, username: user.username, role: user.role })
})

// Token 验证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]  // 前端传入的token

  if (!token) return res.status(401).json({ message: '未提供 Token' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })  // 特定秘钥+算法解析token, 检验是否过期
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: '无效或过期的 Token' })
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})