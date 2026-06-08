# 微信云开发 - 积分商城系统数据库设计

## 环境配置

- **云环境 ID**: `jifen-mall-xxx`（替换为实际）
- **权限规则**: 仅管理员可写，用户只读（小程序端通过云函数操作）

---

## 集合（Collection）设计

### 1. users（用户表）

```javascript
{
  _id: string,              // 自动生成
  user_id: string,          // 用户唯一ID（手动生成）
  openid: string,           // 微信 openid
  unionid?: string,         // 微信 unionid（可选）
  nickname: string,         // 昵称
  avatar: string,           // 头像 URL
  phone: string,            // 手机号（脱敏存储，如 "138****8888"）
  register_time: number,    // 注册时间戳
  points: number,           // 当前积分
  inviter_id?: string,      // 邀请人 user_id
  has_first_checkin: boolean,
  status: 'active' | 'inactive' | 'deleted',
  create_time: number,      // 记录创建时间
  update_time: number       // 记录更新时间
}

索引：
- user_id (unique)
- openid (unique)
- phone (用于搜索)
```

---

### 2. points_records（积分记录表）

```javascript
{
  _id: string,
  record_id: string,        // 记录唯一ID
  user_id: string,          // 用户 ID
  type: 'register' | 'checkin' | 'invite' | 'redeem' | 'manual' | 'phone_change',
  value: number,            // 积分变动值（正数增加，负数减少）
  balance: number,          // 变动后余额
  time: number,             // 时间戳
  detail?: string,          // 备注信息（如调整原因）
  create_time: number
}

索引：
- user_id + time（复合索引，用于查询用户积分明细）
```

---

### 3. products（商品表）

```javascript
{
  _id: string,
  product_id: string,       // 商品 ID
  name: string,
  image: string,            // 商品图片 URL
  points_required: number,
  stock: number,            // 库存
  status: 'active' | 'inactive',
  expiry_date: string,      // 有效期（YYYY-MM-DD）
  description?: string,     // 商品描述
  create_time: number,
  update_time: number
}

索引：
- product_id (unique)
- status + stock（复合索引）
```

---

### 4. redemptions（兑换记录表）

```javascript
{
  _id: string,
  redemption_id: string,    // 兑换记录 ID
  user_id: string,
  product_id: string,
  product_name: string,
  points_used: number,
  redemption_code: string,  // 核销码
  status: 'pending' | 'redeemed' | 'expired',
  redeem_time: number,      // 兑换时间戳
  redeem_deadline: number,  // 过期时间戳
  verify_time?: number,     // 核销时间戳
  create_time: number,
  update_time: number
}

索引：
- redemption_id (unique)
- user_id（用户兑换记录查询）
- redemption_code（核销查询）
- status（管理端筛选）
```

---

### 5. admins（管理员表）

```javascript
{
  _id: string,
  admin_id: string,
  username: string,
  password_hash: string,    // 加密密码
  role: 'super' | 'operation' | 'service',
  status: 'active' | 'inactive',
  create_time: number,
  last_login_time?: number
}

索引：
- admin_id (unique)
- username (unique)
```

---

### 6. points_rules（积分规则表）

```javascript
{
  _id: string,
  rule_id: string,
  register_bonus: number,   // 注册奖励
  daily_checkin: number,    // 每日签到
  invite_bonus: number,     // 邀请奖励
  update_time: number
}

注：此表只维护一条记录
```

---

### 7. operation_logs（操作日志表）

```javascript
{
  _id: string,
  log_id: string,
  operator_id: string,      // 操作人 admin_id
  operator_name: string,
  operation_type: 'points_adjust' | 'points_transfer' | 'user_edit' | 'user_status_change' | 'phone_change',
  target_user_id?: string,
  target_order_id?: string,
  detail: string,           // 操作详情（JSON 或描述）
  created_at: number
}

索引：
- operator_id + created_at（操作人查询）
- target_user_id（用户相关操作查询）
```

---

## 权限配置示例

### users 集合
```json
{
  "read": "auth.openid == doc.openid || doc.openid in get('roles').data[0].admins",
  "write": "doc.openid in get('roles').data[0].admins"
}
```

### redemptions 集合
```json
{
  "read": "auth.openid == doc.openid || doc.openid in get('roles').data[0].admins",
  "write": false  // 全部通过云函数操作
}
```

---

## 初始化数据

### points_rules 初始值
```javascript
{
  rule_id: 'default',
  register_bonus: 100,
  daily_checkin: 10,
  invite_bonus: 50,
  update_time: Date.now()
}
```

### 默认管理员（首次部署后手动创建）
```javascript
{
  admin_id: 'admin001',
  username: 'admin',
  password_hash: '$2a$10$...', // bcrypt 加密后的密码
  role: 'super',
  status: 'active',
  create_time: Date.now()
}
```