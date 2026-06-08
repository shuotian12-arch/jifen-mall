// 云函数入口文件 - 小程序端
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

// ==================== 用户相关 ====================

/**
 * 获取用户信息
 */
async function getUserInfo(openid) {
  const userRes = await db.collection('users').where({ openid }).get()
  if (userRes.data.length === 0) {
    return null
  }
  return userRes.data[0]
}

/**
 * 用户登录/注册
 */
async function login(data, openid) {
  let user = await getUserInfo(openid)

  if (!user) {
    // 新用户注册
    const pointsRuleRes = await db.collection('points_rules').limit(1).get()
    const registerBonus = pointsRuleRes.data.length > 0
      ? pointsRuleRes.data[0].register_bonus
      : 100

    user = {
      _id: generateId('u'),
      user_id: generateId('u'),
      openid,
      nickname: data.nickName || '微信用户',
      avatar: data.avatarUrl || '',
      phone: '',
      register_time: Date.now(),
      points: registerBonus,
      inviter_id: data.inviter_id || null,
      has_first_checkin: false,
      status: 'active',
      create_time: Date.now(),
      update_time: Date.now()
    }

    await db.collection('users').add({ data: user })

    // 记录注册积分
    await db.collection('points_records').add({
      data: {
        _id: generateId('pr'),
        record_id: generateId('pr'),
        user_id: user.user_id,
        type: 'register',
        value: registerBonus,
        balance: registerBonus,
        time: Date.now(),
        detail: '新用户注册奖励',
        create_time: Date.now()
      }
    })
  }

  return {
    user_id: user.user_id,
    nickname: user.nickname,
    avatar: user.avatar,
    phone: user.phone,
    points: user.points,
    has_first_checkin: user.has_first_checkin
  }
}

/**
 * 每日签到
 */
async function checkin(openid) {
  const user = await getUserInfo(openid)
  if (!user) {
    throw new Error('用户不存在')
  }

  // 检查今日是否已签到
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStart = today.getTime()

  const checkinRes = await db.collection('points_records')
    .where({
      user_id: user.user_id,
      type: 'checkin',
      time: _.gte(todayStart)
    })
    .count()

  if (checkinRes.total > 0) {
    throw new Error('今日已签到')
  }

  // 获取签到积分
  const pointsRuleRes = await db.collection('points_rules').limit(1).get()
  const checkinPoints = pointsRuleRes.data.length > 0
    ? pointsRuleRes.data[0].daily_checkin
    : 10

  const newBalance = user.points + checkinPoints

  // 更新用户积分
  await db.collection('users').doc(user._id).update({
    data: {
      points: newBalance,
      has_first_checkin: true,
      update_time: Date.now()
    }
  })

  // 记录签到
  await db.collection('points_records').add({
    data: {
      _id: generateId('pr'),
      record_id: generateId('pr'),
      user_id: user.user_id,
      type: 'checkin',
      value: checkinPoints,
      balance: newBalance,
      time: Date.now(),
      create_time: Date.now()
    }
  })

  // 处理邀请奖励（首次签到）
  if (!user.has_first_checkin && user.inviter_id) {
    const inviterRes = await db.collection('users').where({ user_id: user.inviter_id }).get()
    if (inviterRes.data.length > 0) {
      const inviter = inviterRes.data[0]
      const invitePoints = pointsRuleRes.data.length > 0
        ? pointsRuleRes.data[0].invite_bonus
        : 50
      const inviterNewBalance = inviter.points + invitePoints

      await db.collection('users').doc(inviter._id).update({
        data: {
          points: inviterNewBalance,
          update_time: Date.now()
        }
      })

      await db.collection('points_records').add({
        data: {
          _id: generateId('pr'),
          record_id: generateId('pr'),
          user_id: inviter.user_id,
          type: 'invite',
          value: invitePoints,
          balance: inviterNewBalance,
          time: Date.now(),
          detail: `邀请用户 ${user.user_id} 首次签到`,
          create_time: Date.now()
        }
      })
    }
  }

  return {
    success: true,
    points: checkinPoints,
    newBalance
  }
}

/**
 * 更新手机号
 */
async function updatePhone(data, openid) {
  const { phone } = data
  const user = await getUserInfo(openid)
  if (!user) {
    throw new Error('用户不存在')
  }

  // 检查手机号是否已被使用
  const existRes = await db.collection('users')
    .where({
      phone,
      user_id: _.neq(user.user_id)
    })
    .count()

  if (existRes.total > 0) {
    throw new Error('该手机号已被其他账号使用')
  }

  // 更新手机号
  await db.collection('users').doc(user._id).update({
    data: {
      phone,
      update_time: Date.now()
    }
  })

  return { success: true }
}

// ==================== 商品相关 ====================

/**
 * 获取商品列表
 */
async function getProducts() {
  const res = await db.collection('products')
    .where({ status: 'active' })
    .orderBy('create_time', 'desc')
    .get()
  return res.data
}

/**
 * 获取商品详情
 */
async function getProductDetail(data) {
  const { product_id } = data
  const res = await db.collection('products').where({ product_id }).get()
  if (res.data.length === 0) {
    throw new Error('商品不存在')
  }
  return res.data[0]
}

/**
 * 兑换商品
 */
async function redeemProduct(data, openid) {
  const { product_id } = data
  const user = await getUserInfo(openid)
  if (!user) {
    throw new Error('用户不存在')
  }

  // 获取商品
  const productRes = await db.collection('products').where({ product_id }).get()
  if (productRes.data.length === 0) {
    throw new Error('商品不存在')
  }
  const product = productRes.data[0]

  if (product.status !== 'active') {
    throw new Error('商品已下架')
  }
  if (product.stock <= 0) {
    throw new Error('商品库存不足')
  }
  if (user.points < product.points_required) {
    throw new Error('积分不足')
  }

  // 使用事务
  const transaction = await db.startTransaction()

  try {
    // 扣减库存
    await transaction.collection('products').doc(product._id).update({
      data: {
        stock: _.inc(-1),
        update_time: Date.now()
      }
    })

    // 扣减用户积分
    const newBalance = user.points - product.points_required
    await transaction.collection('users').doc(user._id).update({
      data: {
        points: newBalance,
        update_time: Date.now()
      }
    })

    // 创建兑换记录
    const now = Date.now()
    const deadline = now + 30 * 24 * 60 * 60 * 1000 // 30天后过期
    const redemption = {
      _id: generateId('red'),
      redemption_id: generateId('red'),
      user_id: user.user_id,
      product_id: product.product_id,
      product_name: product.name,
      points_used: product.points_required,
      redemption_code: generateRedemptionCode(),
      status: 'pending',
      redeem_time: now,
      redeem_deadline: deadline,
      create_time: now,
      update_time: now
    }

    await transaction.collection('redemptions').add({ data: redemption })

    // 记录积分变动
    await transaction.collection('points_records').add({
      data: {
        _id: generateId('pr'),
        record_id: generateId('pr'),
        user_id: user.user_id,
        type: 'redeem',
        value: -product.points_required,
        balance: newBalance,
        time: now,
        detail: `兑换商品：${product.name}`,
        create_time: now
      }
    })

    await transaction.commit()
    return { success: true, redemption }
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

// ==================== 记录查询 ====================

/**
 * 获取积分记录
 */
async function getPointsRecords(openid) {
  const user = await getUserInfo(openid)
  if (!user) {
    throw new Error('用户不存在')
  }

  const res = await db.collection('points_records')
    .where({ user_id: user.user_id })
    .orderBy('time', 'desc')
    .limit(100)
    .get()

  return res.data
}

/**
 * 获取兑换记录
 */
async function getRedemptions(openid) {
  const user = await getUserInfo(openid)
  if (!user) {
    throw new Error('用户不存在')
  }

  const res = await db.collection('redemptions')
    .where({ user_id: user.user_id })
    .orderBy('create_time', 'desc')
    .limit(100)
    .get()

  return res.data
}

// ==================== 云函数入口 ====================

exports.main = async (event, context) => {
  const { action, data } = event
  const { OPENID } = cloud.getWXContext()

  try {
    switch (action) {
      case 'login':
        return { success: true, data: await login(data || {}, OPENID) }
      case 'checkin':
        return { success: true, data: await checkin(OPENID) }
      case 'updatePhone':
        return { success: true, data: await updatePhone(data, OPENID) }

      case 'getProducts':
        return { success: true, data: await getProducts() }
      case 'getProductDetail':
        return { success: true, data: await getProductDetail(data) }
      case 'redeemProduct':
        return { success: true, data: await redeemProduct(data, OPENID) }

      case 'getPointsRecords':
        return { success: true, data: await getPointsRecords(OPENID) }
      case 'getRedemptions':
        return { success: true, data: await getRedemptions(OPENID) }

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