# 大模型聊天平台后端

基于Node.js的大模型聊天平台后端，类似豆包的功能实现。

## 项目结构

```
chatModelNode/
├── src/
│   ├── app.js              # 主应用文件
│   ├── config/             # 配置文件
│   │   └── db.js           # 数据库配置
│   ├── controllers/        # 控制器
│   │   ├── userController.js     # 用户控制器
│   │   └── conversationController.js  # 对话控制器
│   ├── middlewares/        # 中间件
│   │   └── auth.js         # 认证中间件
│   ├── models/             # 数据模型
│   │   ├── user.js         # 用户模型
│   │   └── conversation.js # 对话模型
│   ├── routes/             # 路由
│   │   ├── userRoutes.js   # 用户路由
│   │   └── conversationRoutes.js # 对话路由
│   └── utils/              # 工具函数
│       ├── auth.js         # 认证工具
│       └── aiChat.js       # AI聊天工具
├── package.json
└── README.md
```

## 功能特性

1. 用户管理
   - 注册/登录
   - 更新用户名

2. 对话管理
   - 创建新对话
   - 删除对话
   - 获取对话内容
   - 获取用户所有对话
   - 更新对话内容
   - 与AI模型对话（待实现）

## 数据库结构

### 用户表 (users)
- userId: 用户ID（主键）
- userName: 用户名（唯一）
- passWord: 密码（哈希后）
- chatIds: 用户的对话ID列表（JSON数组）

### 对话表 (conversations)
- chatId: 对话ID（主键）
- content: 对话内容（JSON数组，每项包含role和content）
- own: 所属用户ID（外键）
- createdAt: 创建时间

## API接口

### 用户接口

#### 注册
- URL: `/api/users/register`
- 方法: `POST`
- 参数: 
  ```json
  {
    "userName": "13800138000",
    "password": "password123"
  }
  ```
- 返回:
  ```json
  {
    "success": true,
    "message": "注册成功",
    "data": {
      "userId": "1689123456789123",
      "userName": "13800138000",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### 登录
- URL: `/api/users/login`
- 方法: `POST`
- 参数:
  ```json
  {
    "userName": "13800138000",
    "password": "password123"
  }
  ```
- 返回:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "userId": "1689123456789123",
      "userName": "13800138000",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### 更新用户名
- URL: `/api/users/update-username`
- 方法: `PUT`
- 参数:
  ```json
  {
    "userId": "1689123456789123",
    "newUserName": "13900139000"
  }
  ```
- 返回:
  ```json
  {
    "success": true,
    "message": "用户名更新成功",
    "data": {
      "userId": "1689123456789123",
      "userName": "13900139000"
    }
  }
  ```

### 对话接口

#### 创建新对话
- URL: `/api/conversations/create`
- 方法: `POST`
- 参数:
  ```json
  {
    "userId": "1689123456789123",
    "chatId": "1689123456789456"
  }
  ```
- 返回:
  ```json
  {
    "success": true,
    "message": "对话创建成功",
    "data": {
      "chatId": "1689123456789456",
      "content": [],
      "own": "1689123456789123"
    }
  }
  ```

#### 删除对话
- URL: `/api/conversations/delete`
- 方法: `DELETE`
- 参数:
  ```json
  {
    "userId": "1689123456789123",
    "chatId": "1689123456789456"
  }
  ```
- 返回:
  ```json
  {
    "success": true,
    "message": "对话删除成功"
  }
  ```

#### 获取对话内容
- URL: `/api/conversations/get?userId=1689123456789123&chatId=1689123456789456`
- 方法: `GET`
- 返回:
  ```json
  {
    "success": true,
    "data": {
      "chatId": "1689123456789456",
      "content": [
        {"role": "user", "content": "你好"},
        {"role": "assistant", "content": "你好！有什么我可以帮助你的吗？"}
      ],
      "own": "1689123456789123",
      "createdAt": "2023-07-12T12:34:56.789Z"
    }
  }
  ```

#### 获取用户所有对话
- URL: `/api/conversations/list?userId=1689123456789123`
- 方法: `GET`
- 返回:
  ```json
  {
    "success": true,
    "data": [
      {
        "chatId": "1689123456789456",
        "content": [...],
        "own": "1689123456789123",
        "createdAt": "2023-07-12T12:34:56.789Z"
      },
      {
        "chatId": "1689123456789789",
        "content": [...],
        "own": "1689123456789123",
        "createdAt": "2023-07-11T10:20:30.456Z"
      }
    ]
  }
  ```

#### 更新对话内容
- URL: `/api/conversations/update`
- 方法: `PUT`
- 参数:
  ```json
  {
    "userId": "1689123456789123",
    "chatId": "1689123456789456",
    "message": {
      "role": "user",
      "content": "你好，请问你是谁？"
    }
  }
  ```
- 返回:
  ```json
  {
    "success": true,
    "message": "对话内容更新成功"
  }
  ```

#### 与AI对话
- URL: `/api/conversations/chat`
- 方法: `POST`
- 参数:
  ```json
  {
    "message": "你好，请问你是谁？"
  }
  ```
- 返回:
  ```json
  {
    "success": true,
    "data": {
      "response": "你好！我是一个AI助手，可以回答你的问题和提供帮助。"
    }
  }
  ```

## 安装与运行

1. 安装依赖
```bash
npm install
```

2. 配置数据库
编辑 `src/config/db.js` 文件，填入正确的数据库连接信息。

3. 运行服务器
```bash
npm run dev
```

4. 生产环境运行
```bash
npm start
```

## 待实现功能

- 讯飞星火API集成
- 流式返回AI回复
- 用户权限管理
- 对话历史记录分页 