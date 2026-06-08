import { defineStore } from 'pinia'
import type { User, PointsRecord, Redemption } from '@/types'
import { mockUser, mockPointsRecords, mockRedemptions } from '@/utils/mockData'

interface State {
  user: User
  pointsRecords: PointsRecord[]
  redemptions: Redemption[]
}

export const useStore = defineStore('main', {
  state: (): State => ({
    user: { ...mockUser },
    pointsRecords: [...mockPointsRecords],
    redemptions: [...mockRedemptions]
  }),

  getters: {
    userPoints: (state) => state.user.points,
    hasPoints: (state) => (amount: number) => state.user.points >= amount
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
    }
  }
})
