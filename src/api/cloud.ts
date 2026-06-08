import tcb from '@cloudbase/js-sdk'
import { CLOUD_CONFIG, ADMIN_INFO } from '@/config/cloud'

// 初始化云开发
const app = tcb.init({
  env: CLOUD_CONFIG.envId,
  region: CLOUD_CONFIG.region
})

// 获取数据库引用
const db = app.database()
const _ = db.command

/**
 * 调用管理端云函数
 */
async function callAdminFunction(action: string, data: Record<string, unknown> = {}) {
  try {
    const result = await app.callFunction({
      name: 'admin',
      data: {
        action,
        data,
        adminInfo: ADMIN_INFO
      }
    })

    if (result.result && typeof result.result === 'object') {
      return result.result as { success: boolean; data?: unknown; error?: string }
    }

    return { success: false, error: '云函数返回格式错误' }
  } catch (error) {
    console.error('云函数调用失败:', error)
    return { success: false, error: (error as Error).message }
  }
}

// ==================== 用户管理 ====================

export const userApi = {
  // 获取用户列表
  async getList(params: { page?: number; pageSize?: number; phone?: string; status?: string } = {}) {
    return callAdminFunction('getUsers', params)
  },

  // 获取用户详情
  async getDetail(userId: string) {
    return callAdminFunction('getUserDetail', { user_id: userId })
  },

  // 调整积分
  async adjustPoints(userId: string, value: number, reason: string) {
    return callAdminFunction('adjustPoints', { user_id: userId, value, reason })
  },

  // 积分转移
  async transferPoints(fromUserId: string, toUserId: string) {
    return callAdminFunction('transferPoints', { from_user_id: fromUserId, to_user_id: toUserId })
  }
}

// ==================== 商品管理 ====================

export const productApi = {
  // 获取商品列表
  async getList(params: { page?: number; pageSize?: number; status?: string } = {}) {
    return callAdminFunction('getProducts', params)
  },

  // 保存商品（创建或更新）
  async save(data: any) {
    return callAdminFunction('saveProduct', data)
  }
}

// ==================== 兑换管理 ====================

export const redemptionApi = {
  // 获取兑换订单列表
  async getList(params: { page?: number; pageSize?: number; status?: string; redemption_code?: string } = {}) {
    return callAdminFunction('getRedemptions', params)
  },

  // 核销订单
  async verify(redemptionCode: string) {
    return callAdminFunction('verifyRedemption', { redemption_code: redemptionCode })
  }
}

// ==================== 系统设置 ====================

export const settingsApi = {
  // 获取积分规则
  async getRules() {
    return callAdminFunction('getPointsRules')
  },

  // 更新积分规则
  async updateRules(data: any) {
    return callAdminFunction('updatePointsRules', data)
  }
}

// ==================== 操作日志 ====================

export const logApi = {
  // 获取操作日志
  async getList(params: { page?: number; pageSize?: number; operation_type?: string; operator_id?: string } = {}) {
    return callAdminFunction('getOperationLogs', params)
  }
}

// ==================== 管理员认证 ====================

export const authApi = {
  // 登录
  async login(username: string, password: string) {
    return callAdminFunction('adminLogin', { username, password })
  }
}

// 导出数据库引用（用于高级查询）
export { app, db, _ }