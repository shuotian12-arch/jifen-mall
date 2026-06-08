<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button @click="$router.back()" class="w-8 h-8 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">积分明细</h1>
        <div class="w-8"></div>
      </div>
    </div>

    <!-- 积分概览 -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-6">
      <div class="text-sm text-green-100 mb-1">当前积分</div>
      <div class="text-4xl font-bold">{{ user.points }}</div>
    </div>

    <!-- 明细列表 -->
    <div class="p-4">
      <h3 class="text-sm font-medium text-gray-500 mb-3">积分变动记录</h3>
      <div class="bg-white rounded-xl overflow-hidden">
        <div
          v-for="(record, index) in records"
          :key="record.record_id"
          :class="['p-4 flex items-center justify-between', index !== records.length - 1 ? 'border-b border-gray-50' : '']"
        >
          <div>
            <div class="text-gray-800 font-medium">{{ typeLabels[record.type] }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ record.time }}</div>
          </div>
          <div :class="['font-bold', record.value > 0 ? 'text-green-500' : 'text-red-500']">
            {{ record.value > 0 ? '+' : '' }}{{ record.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'
import type { PointsRecord } from '@/types'

const store = useStore()
const user = computed(() => store.user)
const records = computed(() => store.pointsRecords)

const typeLabels: Record<PointsRecord['type'], string> = {
  register: '新人注册奖励',
  checkin: '每日签到',
  invite: '邀请好友奖励',
  redeem: '商品兑换',
  manual: '管理员调整'
}
</script>
