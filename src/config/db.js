import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || '', // 数据库主机地址
  user: process.env.DB_USER || 'root', // 数据库用户名
  password: process.env.DB_PASSWORD || '', // 数据库密码
  database: process.env.DB_NAME || 'chat_model_db' // 数据库名称
}

// 创建数据库连接池
const pool = mysql.createPool(dbConfig)

// 初始化数据库表
async function initDatabase() {
  try {
    const connection = await pool.getConnection()

    // 创建用户表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userId VARCHAR(36) PRIMARY KEY,
        userName VARCHAR(50) NOT NULL UNIQUE,
        passWord VARCHAR(100) NOT NULL,
        chatIds JSON DEFAULT ('[]')
      )
    `)

    // 创建对话表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        chatId VARCHAR(36) PRIMARY KEY,
        content JSON DEFAULT ('[]'),
        own VARCHAR(36) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (own) REFERENCES users(userId) ON DELETE CASCADE
      )
    `)

    console.log('数据库表初始化成功')
    connection.release()
  } catch (error) {
    console.error('数据库表初始化失败:', error)
  }
}

export { pool, initDatabase } 