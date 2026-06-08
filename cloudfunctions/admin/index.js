// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const $ = _.aggregate

/**
 * 生成唯一ID
 */
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 记录操作日志
 */
async function logOperation(db, data) {
  const log = {
    _id: generateId('log'),
    log_id: generateId('log'),
    created_at: Date.now(),
    ...data
  }
  await db.collection('operation_logs').add({ data: log })
  return log
}

// ==================== 用户管理 ====================

/**
 * 获取用户列表
 */
async function getUsers(data) {
  const { page = 1, pageSize = 20, phone, status } = data

  let query = db.collection('users')

  // 筛选条件
  const conditions = {}
  if (phone) {
    conditions.phone = db.RegExp({
      regexp: phone,
      options: 'i'
    })
  }
  if (status) {
    conditions.status = status
  }

  if (Object.keys(conditions).length > 0) {
    query = query.where(conditions)
  }

  // 获取总数
  const countRes = await query.count()

  // 分页获取
  const skip = (page - 1) * pageSize
  const listRes = await query
    .orderBy('create_time', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  return {
    total: countRes.total,
    page,
    pageSize,
    list: listRes.data
  }
}

/**
 * 获取用户详情
 */
async function getUserDetail(data) {
  const { user_id } = data

  // 获取用户信息
  const userRes = await db.collection('users').where({ user_id }).get()
  if (userRes.data.length === 0) {
    throw new Error('用户不存在')
  }
  const user = userRes.data[0]

  // 获取兑换记录
  const redemptionsRes = await db.collection('redemptions')
    .where({ user_id })
    .orderBy('create_time', 'desc')
    .limit(50)
    .get()

  // 获取积分记录
  const pointsRes = await db.collection('points_records')
    .where({ user_id })
    .orderBy('time', 'desc')
    .limit(50)
    .get()

  return {
    user,
    redemptions: redemptionsRes.data,
    pointsRecords: pointsRes.data
  }
}

/**
 * 调整用户积分
 */
async function adjustPoints(data, operatorInfo) {
  const { user_id, value, reason } = data

  if (!value || value === 0) {
    throw new Error('积分变动值不能为空或0')
  }

  // 获取用户
  const userRes = await db.collection('users').where({ user_id }).get()
  if (userRes.data.length === 0) {
    throw new Error('用户不存在')
  }

  const user = userRes.data[0]
  const newBalance = user.points + value

  if (newBalance < 0) {
    throw new Error('积分余额不足')
  }

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
      user_id,
      type: 'manual',
      value,
      balance: newBalance,
      time: Date.now(),
      detail: reason || '管理员调整',
      create_time: Date.now()
    }
  })

  // 记录操作日志
  await logOperation(db, {
    operator_id: operatorInfo.admin_id,
    operator_name: operatorInfo.username,
    operation_type: 'points_adjust',
    target_user_id: user_id,
    detail: `调整积分 ${value > 0 ? '+' : ''}${value}，原因：${reason || '无'}`
  })

  return { success: true, newBalance }
}

/**
 * 积分转移
 */
async function transferPoints(data, operatorInfo) {
  const { from_user_id, to_user_id } = data

  if (from_user_id === to_user_id) {
    throw new Error('不能转移到自己')
  }

  // 获取两个用户
  const [fromUserRes, toUserRes] = await Promise.all([
    db.collection('users').where({ user_id: from_user_id }).get(),
    db.collection('users').where({ user_id: to_user_id }).get()
  ])

  if (fromUserRes.data.length === 0 || toUserRes.data.length === 0) {
    throw new Error('用户不存在')
  }

  const fromUser = fromUserRes.data[0]
  const toUser = toUserRes.data[0]

  if (fromUser.status === 'deleted') {
    throw new Error('源账号已注销')
  }
  if (toUser.status === 'deleted') {
    throw new Error('目标账号已注销')
  }

  const transferAmount = fromUser.points

  // 使用事务
  const transaction = await db.startTransaction()

  try {
    // 1. 更新源账号：积分清零，状态改为已注销
    await transaction.collection('users').doc(fromUser._id).update({
      data: {
        points: 0,
        status: 'deleted',
        update_time: Date.now()
      }
    })

    // 2. 更新目标账号：增加积分
    await transaction.collection('users').doc(toUser._id).update({
      data: {
        points: _.inc(transferAmount),
        update_time: Date.now()
      }
    })

    // 3. 更新积分记录的 user_id
    await transaction.collection('points_records').where({
      user_id: from_user_id
    }).update({
      data: {
        user_id: to_user_id
      }
    })

    // 4. 更新兑换记录的 user_id
    await transaction.collection('redemptions').where({
      user_id: from_user_id
    }).update({
      data: {
        user_id: to_user_id
      }
    })

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }

  // 记录操作日志
  await logOperation(db, {
    operator_id: operatorInfo.admin_id,
    operator_name: operatorInfo.username,
    operation_type: 'points_transfer',
    target_user_id: to_user_id,
    detail: `将用户 ${from_user_id}(${fromUser.phone}) 的 ${transferAmount} 积分转移到 ${to_user_id}(${toUser.phone})`
  })

  return {
    success: true,
    transferAmount,
    fromUser: { user_id: from_user_id, phone: fromUser.phone },
    toUser: { user_id: to_user_id, phone: toUser.phone }
  }
}

// ==================== 商品管理 ====================

/**
 * 获取商品列表
 */
async function getProducts(data) {
  const { page = 1, pageSize = 20, status } = data

  let query = db.collection('products')

  if (status) {
    query = query.where({ status })
  }

  const countRes = await query.count()
  const skip = (page - 1) * pageSize
  const listRes = await query
    .orderBy('create_time', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  return {
    total: countRes.total,
    page,
    pageSize,
    list: listRes.data
  }
}

/**
 * 创建/更新商品
 */
async function saveProduct(data) {
  const { product_id, name, image, points_required, stock, status, expiry_date, description } = data

  if (product_id) {
    // 更新
    const res = await db.collection('products').where({ product_id }).update({
      data: {
        name,
        image,
        points_required,
        stock,
        status,
        expiry_date,
        description,
        update_time: Date.now()
      }
    })
    return { success: true, updated: res.stats.updated }
  } else {
    // 创建
    const newProduct = {
      _id: generateId('p'),
      product_id: generateId('p'),
      name,
      image,
      points_required,
      stock,
      status: status || 'active',
      expiry_date,
      description,
      create_time: Date.now(),
      update_time: Date.now()
    }
    await db.collection('products').add({ data: newProduct })
    return { success: true, product: newProduct }
  }
}

// ==================== 兑换管理 ====================

/**
 * 获取兑换订单列表
 */
async function getRedemptions(data) {
  const { page = 1, pageSize = 20, status, redemption_code } = data

  let query = db.collection('redemptions')

  const conditions = {}
  if (status) {
    conditions.status = status
  }
  if (redemption_code) {
    conditions.redemption_code = db.RegExp({
      regexp: redemption_code,
      options: 'i'
    })
  }

  if (Object.keys(conditions).length > 0) {
    query = query.where(conditions)
  }

  const countRes = await query.count()
  const skip = (page - 1) * pageSize
  const listRes = await query
    .orderBy('create_time', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  return {
    total: countRes.total,
    page,
    pageSize,
    list: listRes.data
  }
}

/**
 * 核销订单
 */
async function verifyRedemption(data, operatorInfo) {
  const { redemption_code } = data

  // 查找订单
  const redemptionRes = await db.collection('redemptions')
    .where({ redemption_code })
    .get()

  if (redemptionRes.data.length === 0) {
    throw new Error('核销码不存在')
  }

  const redemption = redemptionRes.data[0]

  if (redemption.status !== 'pending') {
    throw new Error('该订单已核销或已过期')
  }

  // 检查是否过期
  if (redemption.redeem_deadline < Date.now()) {
    throw new Error('该订单已过期')
  }

  // 更新状态
  await db.collection('redemptions').doc(redemption._id).update({
    data: {
      status: 'redeemed',
      verify_time: Date.now(),
      update_time: Date.now()
    }
  })

  // 记录操作日志
  await logOperation(db, {
    operator_id: operatorInfo.admin_id,
    operator_name: operatorInfo.username,
    operation_type: 'redemption_verify',
    target_order_id: redemption.redemption_id,
    detail: `核销订单 ${redemption_code}，商品：${redemption.product_name}`
  })

  return { success: true, redemption_id: redemption.redemption_id }
}

// ==================== 系统设置 ====================

/**
 * 获取积分规则
 */
async function getPointsRules() {
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
 * 更新积分规则
 */
async function updatePointsRules(data, operatorInfo) {
  const { register_bonus, daily_checkin, invite_bonus } = data

  const existing = await db.collection('points_rules').limit(1).get()

  const ruleData = {
    register_bonus,
    daily_checkin,
    invite_bonus,
    update_time: Date.now()
  }

  if (existing.data.length === 0) {
    await db.collection('points_rules').add({
      data: {
        _id: 'default',
        rule_id: 'default',
        ...ruleData
      }
    })
  } else {
    await db.collection('points_rules').doc(existing.data[0]._id).update({
      data: ruleData
    })
  }

  await logOperation(db, {
    operator_id: operatorInfo.admin_id,
    operator_name: operatorInfo.username,
    operation_type: 'settings_update',
    detail: `更新积分规则：注册+${register_bonus}，签到+${daily_checkin}，邀请+${invite_bonus}`
  })

  return { success: true }
}

/**
 * 获取操作日志
 */
async function getOperationLogs(data) {
  const { page = 1, pageSize = 20, operation_type, operator_id } = data

  let query = db.collection('operation_logs')

  const conditions = {}
  if (operation_type) {
    conditions.operation_type = operation_type
  }
  if (operator_id) {
    conditions.operator_id = operator_id
  }

  if (Object.keys(conditions).length > 0) {
    query = query.where(conditions)
  }

  const countRes = await query.count()
  const skip = (page - 1) * pageSize
  const listRes = await query
    .orderBy('created_at', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  return {
    total: countRes.total,
    page,
    pageSize,
    list: listRes.data
  }
}

// ==================== 管理员认证 ====================

/**
 * 管理员登录
 */
async function adminLogin(data) {
  const { username, password } = data

  if (!username || !password) {
    throw new Error('用户名和密码不能为空')
  }

  const adminRes = await db.collection('admins').where({
    username,
    status: 'active'
  }).get()

  if (adminRes.data.length === 0) {
    throw new Error('用户名或密码错误')
  }

  const admin = adminRes.data[0]

  // TODO: 使用 bcrypt 验证密码
  // 这里简化处理，实际应使用加密密码
  if (admin.password_hash !== password && admin.password_hash !== require('crypto').createHash('md5').update(password).digest('hex')) {
    throw new Error('用户名或密码错误')
  }

  // 更新最后登录时间
  await db.collection('admins').doc(admin._id).update({
    data: {
      last_login_time: Date.now()
    }
  })

  return {
    success: true,
    admin: {
      admin_id: admin.admin_id,
      username: admin.username,
      role: admin.role
    },
    token: generateId('token') // TODO: 应使用 JWT
  }
}

// ==================== 云函数入口 ====================

exports.main = async (event, context) => {
  const { action, data, adminInfo } = event

  try {
    // 需要验证管理员权限的操作
    const adminRequiredActions = [
      'getUsers', 'getUserDetail', 'adjustPoints', 'transferPoints',
      'getProducts', 'saveProduct',
      'getRedemptions', 'verifyRedemption',
      'getPointsRules', 'updatePointsRules',
      'getOperationLogs'
    ]

    let operatorInfo = adminInfo

    if (adminRequiredActions.includes(action)) {
      // 验证管理员权限（简化处理，实际应验证 token）
      if (!adminInfo || !adminInfo.admin_id) {
        throw new Error('需要管理员权限')
      }
    }

    // 路由处理
    switch (action) {
      // 用户管理
      case 'getUsers':
        return { success: true, data: await getUsers(data) }
      case 'getUserDetail':
        return { success: true, data: await getUserDetail(data) }
      case 'adjustPoints':
        return { success: true, data: await adjustPoints(data, operatorInfo) }
      case 'transferPoints':
        return { success: true, data: await transferPoints(data, operatorInfo) }

      // 商品管理
      case 'getProducts':
        return { success: true, data: await getProducts(data) }
      case 'saveProduct':
        return { success: true, data: await saveProduct(data) }

      // 兑换管理
      case 'getRedemptions':
        return { success: true, data: await getRedemptions(data) }
      case 'verifyRedemption':
        return { success: true, data: await verifyRedemption(data, operatorInfo) }

      // 系统设置
      case 'getPointsRules':
        return { success: true, data: await getPointsRules() }
      case 'updatePointsRules':
        return { success: true, data: await updatePointsRules(data, operatorInfo) }

      // 操作日志
      case 'getOperationLogs':
        return { success: true, data: await getOperationLogs(data) }

      // 管理员登录
      case 'adminLogin':
        return { success: true, data: await adminLogin(data) }

      default:
        throw new Error(`未知操作: ${action}`)
    }
  } catch (error) {
    console.error('云函数执行错误:', error)
    return {
      success: false,
      error: error.message || '服务器内部错误'
    }
  }
}