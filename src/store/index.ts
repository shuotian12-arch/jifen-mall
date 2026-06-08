import { defineStore } from 'pinia'
import type { User, PointsRecord, Redemption, OperationLog } from '@/types'
import { mockUsers, mockPointsRecords, mockRedemptions, mockOperationLogs, mockPointsRule } from '@/utils/mockData'
import { userApi, productApi, redemptionApi, settingsApi } from '@/api/cloud'
import { USE_MOCK_DATA } from '@/config/env'

interface State {
  user: User | null
  users: User[]
  pointsRecords: PointsRecord[]
  redemptions: Redemption[]
  operationLogs: OperationLog[]
  products: any[]
  pointsRules: any
  loading: boolean
}

export const useStore = defineStore('main', {
  state: (): State => ({
    user: mockUsers[0],
    users: [...mockUsers],
    pointsRecords: [...mockPointsRecords],
    redemptions: [...mockRedemptions],
    operationLogs: [...mockOperationLogs],
    products: [],
    pointsRules: mockPointsRule,
    loading: false
  }),

  getters: {
    userPoints: (state) => state.user?.points || 0,
    hasPoints: (state) => (amount: number) => (state.user?.points || 0) >= amount,
    activeUsers: (state) => state.users.filter(u => u.status === 'active'),
    getUserByPhone: (state) => (phone: string) => state.users.find(u => u.phone === phone),
    getUserRedemptions: (state) => (userId: string) => state.redemptions.filter(r => r.user_id === userId),
    getUserPointsRecords: (state) => (userId: string) => state.pointsRecords.filter(p => p.user_id === userId)
  },

  actions: {
    // ==================== 用户管理 ====================

    async fetchUsers(params: { phone?: string; status?: string } = {}) {
      this.loading = true
      if (USE_MOCK_DATA) {
        // 模拟数据模式：本地过滤
        this.users = mockUsers.filter(u => {
          const matchPhone = !params.phone || u.phone.includes(params.phone)
          const matchStatus = !params.status || u.status === params.status
          return matchPhone && matchStatus
        })
        this.loading = false
        return { success: true, data: { list: this.users } }
      }

      // 云开发模式
      const result = await userApi.getList(params)
      if (result.success && result.data) {
        this.users = (result.data as any).list || []
      }
      this.loading = false
      return result
    },

    async fetchUserDetail(userId: string) {
      if (USE_MOCK_DATA) {
        const user = this.users.find(u => u.user_id === userId)
        return {
          user,
          redemptions: this.redemptions.filter(r => r.user_id === userId),
          pointsRecords: this.pointsRecords.filter(p => p.user_id === userId)
        }
      }

      this.loading = true
      const result = await userApi.getDetail(userId)
      this.loading = false
      return result.success ? result.data : null
    },

    async adjustPoints(userId: string, value: number, reason: string) {
      if (USE_MOCK_DATA) {
        const user = this.users.find(u => u.user_id === userId)
        if (user) {
          user.points += value
          this.addOperationLog({
            operation_type: 'points_adjust',
            target_user_id: userId,
            detail: `调整积分 ${value > 0 ? '+' : ''}${value}，原因：${reason}`
          })
          return { success: true, newBalance: user.points }
        }
        return { success: false, error: '用户不存在' }
      }

      const result = await userApi.adjustPoints(userId, value, reason)
      if (result.success) {
        await this.fetchUsers()
      }
      return result
    },

    async transferPoints(fromUserId: string, toUserId: string) {
      if (USE_MOCK_DATA) {
        const fromUser = this.users.find(u => u.user_id === fromUserId)
        const toUser = this.users.find(u => u.user_id === toUserId)

        if (!fromUser || !toUser) {
          return { success: false, error: '用户不存在' }
        }
        if (fromUser.user_id === toUser.user_id) {
          return { success: false, error: '不能转移给自己' }
        }

        const transferAmount = fromUser.points

        toUser.points += transferAmount
        fromUser.points = 0
        fromUser.status = 'deleted'

        this.pointsRecords
          .filter(r => r.user_id === fromUserId)
          .forEach(r => {
            r.user_id = toUserId
          })

        this.redemptions
          .filter(r => r.user_id === fromUserId)
          .forEach(r => {
            r.user_id = toUserId
          })

        this.addOperationLog({
          operation_type: 'points_transfer',
          target_user_id: toUserId,
          detail: `将用户 ${fromUserId}(${fromUser.phone}) 的 ${transferAmount} 积分转移到 ${toUserId}(${toUser.phone})`
        })

        return { success: true, transferAmount }
      }

      const result = await userApi.transferPoints(fromUserId, toUserId)
      if (result.success) {
        await this.fetchUsers()
      }
      return result
    },

    async changePhone(userId: string, newPhone: string) {
      if (USE_MOCK_DATA) {
        const user = this.users.find(u => u.user_id === userId)
        if (user) {
          const oldPhone = user.phone
          user.phone = newPhone
          this.addOperationLog({
            operation_type: 'phone_change',
            target_user_id: userId,
            detail: `用户修改手机号：${oldPhone} → ${newPhone}`
          })
          return true
        }
        return false
      }

      // 云开发模式：需要实现相应接口
      console.warn('changePhone cloud API not implemented')
      return false
    },

    // ==================== 商品管理 ====================

    async fetchProducts(params: { status?: string } = {}) {
      if (USE_MOCK_DATA) {
        return { success: true, data: { list: [] } }
      }

      this.loading = true
      const result = await productApi.getList(params)
      if (result.success && result.data) {
        this.products = (result.data as any).list || []
      }
      this.loading = false
      return result
    },

    async saveProduct(data: any) {
      if (USE_MOCK_DATA) {
        return { success: true }
      }

      const result = await productApi.save(data)
      if (result.success) {
        await this.fetchProducts()
      }
      return result
    },

    // ==================== 兑换管理 ====================

    async fetchRedemptions(params: { status?: string; redemption_code?: string } = {}) {
      if (USE_MOCK_DATA) {
        let list = this.redemptions
        if (params.status) {
          list = list.filter(r => r.status === params.status)
        }
        if (params.redemption_code) {
          list = list.filter(r => r.redemption_code.includes(params.redemption_code!))
        }
        return { success: true, data: { list } }
      }

      this.loading = true
      const result = await redemptionApi.getList(params)
      if (result.success && result.data) {
        this.redemptions = (result.data as any).list || []
      }
      this.loading = false
      return result
    },

    async verifyRedemption(redemptionId: string) {
      if (USE_MOCK_DATA) {
        const redemption = this.redemptions.find(r => r.redemption_id === redemptionId)
        if (redemption) {
          redemption.status = 'redeemed'
          redemption.verify_time = new Date().toISOString()
        }
        return { success: true }
      }

      const result = await redemptionApi.verify(redemptionId || '')
      if (result.success) {
        await this.fetchRedemptions()
      }
      return result
    },

    // ==================== 系统设置 ====================

    async fetchPointsRules() {
      if (USE_MOCK_DATA) {
        return { success: true, data: this.pointsRules }
      }

      const result = await settingsApi.getRules()
      if (result.success && result.data) {
        this.pointsRules = result.data
      }
      return result
    },

    async updatePointsRules(data: any) {
      if (USE_MOCK_DATA) {
        this.pointsRules = { ...this.pointsRules, ...data }
        return { success: true }
      }

      const result = await settingsApi.updateRules(data)
      if (result.success) {
        await this.fetchPointsRules()
      }
      return result
    },

    // ==================== 内部方法 ====================

    addPoints(value: number, type: PointsRecord['type']) {
      if (!this.user) return

      const record: PointsRecord = {
        record_id: `r${Date.now()}`,
        user_id: this.user.user_id,
        type,
        value,
        balance: this.user.points + value,
        time: new Date().toLocaleString()
      }
      this.pointsRecords.unshift(record)
      this.user.points += value
    },

    redeemProduct(data: { redemption_id: string; product_id: string; product_name: string; points_used: number; redemption_code: string }) {
      if (!this.user) return

      const now = new Date()
      const deadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      const redemption: Redemption = {
        redemption_id: data.redemption_id,
        user_id: this.user.user_id,
        product_id: data.product_id,
        product_name: data.product_name,
        points_used: data.points_used,
        redemption_code: data.redemption_code,
        status: 'pending',
        redeem_time: now.toLocaleString(),
        redeem_deadline: deadline.toLocaleString(),
        verify_time: null
      }

      this.redemptions.unshift(redemption)
      this.addPoints(-data.points_used, 'redeem')
    },

    addOperationLog(data: Partial<OperationLog>) {
      const log: OperationLog = {
        log_id: `log${Date.now()}`,
        operator_id: 'a001',
        operator_name: 'admin',
        operation_type: data.operation_type || 'points_adjust',
        target_user_id: data.target_user_id,
        target_order_id: data.target_order_id,
        detail: data.detail || '',
        created_at: new Date().toLocaleString()
      }
      this.operationLogs.unshift(log)
    }
  }
})