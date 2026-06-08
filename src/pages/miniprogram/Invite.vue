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
        <h1 class="text-lg font-semibold">邀请好友</h1>
        <div class="w-8"></div>
      </div>
    </div>

    <!-- 邀请说明 -->
    <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-6">
      <div class="text-2xl font-bold mb-2">邀请好友 赚积分</div>
      <div class="text-orange-100">每邀请一位好友完成首次签到，您可获得 {{ pointsRule.invite_bonus }} 积分</div>
    </div>

    <!-- 邀请步骤 -->
    <div class="p-4">
      <h3 class="font-medium text-gray-800 mb-4">如何邀请</h3>
      <div class="space-y-3">
        <div class="bg-white rounded-xl p-4 flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">1</div>
          <div>
            <div class="font-medium text-gray-800">分享邀请链接</div>
            <div class="text-sm text-gray-500 mt-1">将专属邀请链接分享给好友</div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">2</div>
          <div>
            <div class="font-medium text-gray-800">好友注册登录</div>
            <div class="text-sm text-gray-500 mt-1">好友通过链接注册并登录小程序</div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">3</div>
          <div>
            <div class="font-medium text-gray-800">好友完成签到</div>
            <div class="text-sm text-gray-500 mt-1">好友首次签到后，您的积分自动到账</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的邀请链接 -->
    <div class="p-4">
      <div class="bg-white rounded-xl p-4">
        <h3 class="font-medium text-gray-800 mb-3">我的邀请链接</h3>
        <div class="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
          <input
            type="text"
            :value="inviteLink"
            readonly
            class="flex-1 bg-transparent text-sm text-gray-600 outline-none"
          />
          <button @click="copyLink" class="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg">
            复制
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-2">邀请码: {{ user.user_id }}</p>
      </div>
    </div>

    <!-- 邀请记录 -->
    <div class="p-4">
      <h3 class="font-medium text-gray-800 mb-3">邀请记录</h3>
      <div class="bg-white rounded-xl overflow-hidden">
        <div v-if="inviteRecords.length === 0" class="p-6 text-center text-gray-400">
          暂无邀请记录
        </div>
        <div v-for="(record, index) in inviteRecords" :key="index" :class="['p-4 flex items-center justify-between', index !== inviteRecords.length - 1 ? 'border-b border-gray-50' : '']">
          <div>
            <div class="text-gray-800">{{ record.nickname }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ record.time }}</div>
          </div>
          <div class="text-green-500 font-medium">+{{ pointsRule.invite_bonus }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/store'
import { mockPointsRule } from '@/utils/mockData'

const store = useStore()
const user = computed(() => store.user)
const pointsRule = mockPointsRule

const inviteLink = computed(() => `https://jifen.mall/invite/${user.value.user_id}`)

const inviteRecords = ref([
  { nickname: '用户A', time: '2026-06-03 15:20' },
  { nickname: '用户B', time: '2026-06-08 14:30' }
])

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink.value)
  alert('链接已复制')
}
</script>
