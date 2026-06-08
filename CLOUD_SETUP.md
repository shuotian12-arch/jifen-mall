# 积分商城 - 云开发接入指南

## 项目结构

```
jifen-mall/
├── src/
│   ├── api/
│   │   └── cloud.ts          # 云开发 API 封装
│   ├── config/
│   │   └── env.ts            # 环境配置（USE_MOCK_DATA 开关）
│   ├── store/
│   │   └── index.ts          # Store（支持模拟数据和云开发双模式）
│   └── ...
├── cloudFunctions/
│   ├── admin/
│   │   ├── index.js          # 管理端云函数
│   │   └── package.json
│   ├── mp/
│   │   ├── index.js          # 小程序端云函数
│   │   └── package.json
│   └── common/
│       └── utils.js          # 云函数公共工具
└── cloud-database-design.md  # 数据库设计文档
```

## 快速开始

### 1. 配置云开发环境

编辑 `src/config/env.ts`：

```typescript
// 设置为 false 使用云开发数据
export const USE_MOCK_DATA = false

// 替换为你的云开发环境ID
export const CLOUD_CONFIG = {
  envId: 'your-env-id',
  region: 'ap-shanghai'
}
```

### 2. 在微信开发者工具中创建云环境

1. 打开微信开发者工具
2. 新建项目，选择「小程序」
3. 开通云开发（云开发 → 开通）
4. 创建云环境，记下环境ID

### 3. 上传云函数

在微信开发者工具中：

```
cloudFunctions/
├── admin/     # 右键 → 上传并部署：云端安装依赖
└── mp/        # 右键 → 上传并部署：云端安装依赖
```

### 4. 创建数据库集合

在云开发控制台 → 数据库中创建以下集合：

| 集合名 | 用途 |
|--------|------|
| users | 用户表 |
| points_records | 积分记录表 |
| products | 商品表 |
| redemptions | 兑换记录表 |
| admins | 管理员表 |
| points_rules | 积分规则表 |
| operation_logs | 操作日志表 |

### 5. 初始化数据

在数据库中手动插入：

**points_rules**（积分规则）：
```json
{
  "rule_id": "default",
  "register_bonus": 100,
  "daily_checkin": 10,
  "invite_bonus": 50,
  "update_time": 1234567890
}
```

**admins**（管理员）：
```json
{
  "admin_id": "admin001",
  "username": "admin",
  "password_hash": "admin",  // 生产环境应加密
  "role": "super",
  "status": "active",
  "create_time": 1234567890
}
```

### 6. 配置管理端静态托管

在云开发控制台 → 静态网站托管：

1. 开通静态网站托管
2. 执行 `npm run build` 打包管理端
3. 将 `dist` 目录上传到静态托管根目录

## 开发模式切换

### 使用模拟数据（本地开发）

在 `src/config/env.ts` 中设置：
```typescript
export const USE_MOCK_DATA = true
```

### 使用云开发（生产）

```typescript
export const USE_MOCK_DATA = false
```

## 云函数 API 文档

### 管理端云函数（admin）

#### 用户管理
- `getUsers` - 获取用户列表
- `getUserDetail` - 获取用户详情
- `adjustPoints` - 调整用户积分
- `transferPoints` - 积分转移

#### 商品管理
- `getProducts` - 获取商品列表
- `saveProduct` - 保存商品

#### 兑换管理
- `getRedemptions` - 获取兑换订单列表
- `verifyRedemption` - 核销订单

#### 系统设置
- `getPointsRules` - 获取积分规则
- `updatePointsRules` - 更新积分规则
- `getOperationLogs` - 获取操作日志

#### 认证
- `adminLogin` - 管理员登录

### 小程序端云函数（mp）

- `login` - 用户登录/注册
- `checkin` - 每日签到
- `updatePhone` - 更新手机号
- `getProducts` - 获取商品列表
- `getProductDetail` - 获取商品详情
- `redeemProduct` - 兑换商品
- `getPointsRecords` - 获取积分记录
- `getRedemptions` - 获取兑换记录

## 注意事项

1. **安全**：生产环境必须实现真正的管理员认证（JWT）
2. **密码加密**：使用 bcrypt 等方式加密存储密码
3. **权限控制**：设置数据库权限规则
4. **事务处理**：涉及多表操作使用数据库事务
5. **错误处理**：云函数中完善错误捕获和日志记录

## 后续工作

- [ ] 实现真正的 JWT 认证
- [ ] 添加操作日志页面
- [ ] 添加数据看板
- [ ] 小程序端开发
- [ ] 单元测试
- [ ] CI/CD 流程