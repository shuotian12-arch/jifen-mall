<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 用户信息卡片 -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-8">
      <div class="flex items-center gap-4">
        <img :src="user.avatar" class="w-16 h-16 rounded-full border-2 border-white" />
        <div>
          <div class="font-medium text-lg">{{ user.nickname }}</div>
          <div class="text-green-100 text-sm mt-1">{{ user.phone }}</div>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-between bg-white/20 rounded-xl p-4">
        <div>
          <div class="text-green-100 text-sm">我的积分</div>
          <div class="text-2xl font-bold mt-1">{{ user.points }}</div>
        </div>
        <router-link to="/points" class="px-4 py-2 bg-white text-green-600 rounded-lg text-sm font-medium">
          查看明细
        </router-link>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="p-4 space-y-3">
      <div class="bg-white rounded-xl overflow-hidden">
        <router-link to="/orders" class="flex items-center justify-between p-4 border-b border-gray-50">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span class="text-gray-800">兑换记录</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
        <router-link to="/invite" class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span class="text-gray-800">邀请好友</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <div class="bg-white rounded-xl overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-gray-50">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-gray-800">注册时间</span>
          </div>
          <span class="text-gray-400 text-sm">{{ user.register_time }}</span>
        </div>
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-gray-800">签到状态</span>
          </div>
          <span class="text-green-500 text-sm">已签到</span>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 safe-area-bottom">
      <div class="flex justify-around">
        <router-link to="/" class="flex flex-col items-center py-2 px-4 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M3 20a2 2 0 002-2v-2a2 2 0 00-2 2v2a2 2 0 002 2z" />
          </svg>
          <span class="text-xs mt-1">首页</span>
        </router-link>
        <router-link to="/invite" class="flex flex-col items-center py-2 px-4 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xs mt-1">邀请</span>
        </router-link>
        <router-link to="/profile" class="flex flex-col items-center py-2 px-4 text-green-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs mt-1">我的</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const user = computed(() => store.user)
</script>
