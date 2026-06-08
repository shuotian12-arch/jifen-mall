// 云开发公共函数库
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 生成唯一ID
 */
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 脱敏手机号
 */
function maskPhone(phone) {
  if (!phone || phone.length !== 11) return phone
  return `${phone.slice(0, 3)}****${phone.slice(7)}`
}

/**
 * 生成核销码
 */
function generateRedemptionCode() {
  const now = new Date()
  const dateStr = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `RM${dateStr}${random}`
}

/**
 * 验证管理员权限
 */
async function verifyAdmin(event) {
  const { admin_id, token } = event
  if (!admin_id || !token) {
    throw new Error('缺少管理员凭证')
  }

  const adminRes = await db.collection('admins').where({
    admin_id,
    status: 'active'
  }).get()

  if (adminRes.data.length === 0) {
    throw new Error('管理员不存在或已被禁用')
  }

  // TODO: 验证 token（实际应使用 JWT 或 session）
  // 这里简化处理，后续应添加真实验证

  return adminRes.data[0]
}

/**
 * 记录操作日志
 */
async function logOperation(data) {
  const log = {
    _id: generateId('log'),
    log_id: generateId('log'),
    created_at: Date.now(),
    ...data
  }
  await db.collection('operation_logs').add({ data: log })
  return log
}

/**
 * 获取积分规则
 */
async function getPointsRule() {
  const res = await db.collection('points_rules').limit(1).get()
  if (res.data.length === 0) {
    return {
      rule_id: 'default',
      register_bonus: 100,
      daily_checkin: 10,
      invite_bonus: 50,
      update_time: Date.now()
    }
  }
  return res.data[0]
}

/**
 * 增加用户积分
 */
async function addUserPoints(userId, value, type, detail = '') {
  const userRes = await db.collection('users').where({ user_id: userId }).get()
  if (userRes.data.length === 0) {
    throw new Error('用户不存在')
  }

  const user = userRes.data[0]
  const newBalance = user.points + value

  // 更新用户积分
  await db.collection('users').doc(user._id).update({
    data: {
      points: newBalance,
      update_time: Date.now()
    }
  })

  // 记录积分变动
  await db.collection('points_records').add({
    data: {
      _id: generateId('pr'),
      record_id: generateId('pr'),
      user_id: userId,
      type,
      value,
      balance: newBalance,
      time: Date.now(),
      detail,
      create_time: Date.now()
    }
  })

  return newBalance
}

module.exports = {
  cloud,
  db,
  _,
  generateId,
  maskPhone,
  generateRedemptionCode,
  verifyAdmin,
  logOperation,
  getPointsRule,
  addUserPoints
}