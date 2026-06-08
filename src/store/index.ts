import { defineStore } from 'pinia'
import type { User, PointsRecord, Redemption, OperationLog } from '@/types'
import { mockUser, mockUsers, mockPointsRecords, mockRedemptions, mockOperationLogs } from '@/utils/mockData'

interface State {
  user: User
  users: User[]
  pointsRecords: PointsRecord[]
  redemptions: Redemption[]
  operationLogs: OperationLog[]
  currentAdmin: {
    admin_id: string
    username: string
  }
}

export const useStore = defineStore('main', {
  state: (): State => ({
    user: { ...mockUser },
    users: [...mockUsers],
    pointsRecords: [...mockPointsRecords],
    redemptions: [...mockRedemptions],
    operationLogs: [...mockOperationLogs],
    currentAdmin: {
      admin_id: 'a001',
      username: 'admin'
    }
  }),

  getters: {
    userPoints: (state) => state.user.points,
    hasPoints: (state) => (amount: number) => state.user.points >= amount,
    activeUsers: (state) => state.users.filter(u => u.status === 'active'),
    getUserByPhone: (state) => (phone: string) => state.users.find(u => u.phone === phone),
    getUserRedemptions: (state) => (userId: string) =>
      state.redemptions.filter(r => r.user_id === userId),
    getUserPointsRecords: (state) => (userId: string) =>
      state.pointsRecords.filter(p => p.user_id === userId)
  },

  actions: {
    addPoints(value: number, type: PointsRecord['type']) {
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

    verifyRedemption(redemptionId: string) {
      const redemption = this.redemptions.find(r => r.redemption_id === redemptionId)
      if (redemption) {
        redemption.status = 'redeemed'
        redemption.verify_time = new Date().toLocaleString()
      }
    },

    adjustUserPoints(userId: string, value: number, reason: string) {
      if (userId === this.user.user_id) {
        this.addPoints(value, 'manual')
      }

      const user = this.users.find(u => u.user_id === userId)
      if (user) {
        user.points += value
        this.addOperationLog({
          operation_type: 'points_adjust',
          target_user_id: userId,
          detail: `调整积分 ${value > 0 ? '+' : ''}${value}，原因：${reason}`
        })
      }
    },

    addOperationLog(data: Partial<OperationLog>) {
      const log: OperationLog = {
        log_id: `log${Date.now()}`,
        operator_id: this.currentAdmin.admin_id,
        operator_name: this.currentAdmin.username,
        operation_type: data.operation_type || 'points_adjust',
        target_user_id: data.target_user_id,
        target_order_id: data.target_order_id,
        detail: data.detail || '',
        created_at: new Date().toLocaleString()
      }
      this.operationLogs.unshift(log)
    },

    changePhone(userId: string, newPhone: string) {
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
    },

    transferPoints(fromUserId: string, toUserId: string) {
      const fromUser = this.users.find(u => u.user_id === fromUserId)
      const toUser = this.users.find(u => u.user_id === toUserId)

      if (!fromUser || !toUser) {
        return { success: false, message: '用户不存在' }
      }

      if (fromUser.user_id === toUser.user_id) {
        return { success: false, message: '不能转移给自己' }
      }

      const pointsTransferred = fromUser.points

      toUser.points += pointsTransferred
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
        detail: `将用户 ${fromUserId}(${fromUser.phone}) 的 ${pointsTransferred} 积分及历史记录转移到用户 ${toUserId}(${toUser.phone})，原账号标记为已注销`
      })

      return { success: true, message: '转移成功' }
    }
  }
})