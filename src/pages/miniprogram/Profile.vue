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
        <div class="flex items-center justify-between p-4 border-b border-gray-50">
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
        <button @click="showPhoneModal = true" class="w-full flex items-center justify-between p-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span class="text-gray-800">修改手机号</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 修改手机号弹窗 -->
    <div v-if="showPhoneModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click="showPhoneModal = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm" @click.stop>
        <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">修改手机号</h3>

        <div v-if="phoneStep === 1" class="space-y-4">
          <p class="text-sm text-gray-500 text-center">点击下方按钮，使用微信授权获取新手机号</p>
          <button
            @click="handleGetPhone"
            class="w-full py-3 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            微信授权获取手机号
          </button>
        </div>

        <div v-else-if="phoneStep === 2" class="space-y-4">
          <div class="text-center py-4">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-800 font-medium">新手机号</p>
            <p class="text-2xl font-bold text-green-600 mt-2">{{ newPhone }}</p>
          </div>
          <div class="flex gap-3">
            <button @click="phoneStep = 1; newPhone = ''" class="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600">
              重新获取
            </button>
            <button @click="handleConfirmPhone" class="flex-1 py-3 bg-green-500 text-white rounded-xl">
              确认修改
            </button>
          </div>
        </div>

        <div v-else-if="phoneStep === 3" class="text-center py-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-gray-800 font-medium">手机号修改成功</p>
          <button @click="showPhoneModal = false; phoneStep = 1; newPhone = ''" class="mt-4 w-full py-3 bg-gray-100 rounded-xl text-gray-600">
            关闭
          </button>
        </div>

        <button v-if="phoneStep !== 3" @click="showPhoneModal = false; phoneStep = 1; newPhone = ''" class="mt-4 w-full py-2 text-gray-400 text-sm">
          取消
        </button>
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
import { ref, computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const user = computed(() => store.user)
const showPhoneModal = ref(false)
const phoneStep = ref(1)
const newPhone = ref('')

const handleGetPhone = () => {
  newPhone.value = '139****' + Math.floor(1000 + Math.random() * 9000)
  phoneStep.value = 2
}

const handleConfirmPhone = () => {
  if (store.changePhone(user.value.user_id, newPhone.value)) {
    phoneStep.value = 3
  } else {
    alert('修改失败')
  }
}
</script>
