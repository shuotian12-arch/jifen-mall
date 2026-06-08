<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 快捷入口 -->
    <div class="px-4 pt-4">
      <div class="bg-white rounded-xl shadow-sm p-4 grid grid-cols-3 gap-4">
        <button @click="handleCheckin" class="flex flex-col items-center gap-2 py-2" :disabled="checkedIn">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center', checkedIn ? 'bg-gray-100' : 'bg-orange-100']">
            <svg :class="['w-5 h-5', checkedIn ? 'text-gray-400' : 'text-orange-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span :class="['text-xs', checkedIn ? 'text-gray-400' : 'text-gray-700']">{{ checkedIn ? '已签到' : '签到' }}</span>
        </button>
        <router-link to="/points" class="flex flex-col items-center gap-2 py-2">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span class="text-xs text-gray-700">积分明细</span>
        </router-link>
        <router-link to="/orders" class="flex flex-col items-center gap-2 py-2">
          <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span class="text-xs text-gray-700">兑换记录</span>
        </router-link>
      </div>
    </div>

    <!-- 积分规则提示 -->
    <div class="px-4 mt-4">
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-amber-800">
          <div class="font-medium mb-1">赚积分小贴士</div>
          <div class="text-xs text-amber-600">每日签到+{{ pointsRule.daily_checkin }}分 | 邀请好友+{{ pointsRule.invite_bonus }}分</div>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="px-4 mt-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">积分商城</h2>
        <span class="text-sm text-gray-500">共{{ products.length }}件商品</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <router-link
          v-for="product in products"
          :key="product.product_id"
          :to="`/product/${product.product_id}`"
          class="bg-white rounded-xl overflow-hidden shadow-sm"
        >
          <img :src="product.image" class="w-full aspect-square object-cover" />
          <div class="p-3">
            <h3 class="text-sm font-medium text-gray-800 truncate">{{ product.name }}</h3>
            <div class="flex items-center justify-between mt-2">
              <span class="text-orange-500 font-bold">{{ product.points_required }}积分</span>
              <span v-if="product.stock === 0" class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">售罄</span>
              <span v-else class="text-xs text-gray-400">库存{{ product.stock }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 safe-area-bottom">
      <div class="flex justify-around">
        <router-link to="/" class="flex flex-col items-center py-2 px-4" :class="$route.path === '/' ? 'text-green-500' : 'text-gray-400'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M3 20a2 2 0 002-2v-2a2 2 0 00-2 2v2a2 2 0 002 2z" />
          </svg>
          <span class="text-xs mt-1">首页</span>
        </router-link>
        <router-link to="/invite" class="flex flex-col items-center py-2 px-4" :class="$route.path === '/invite' ? 'text-green-500' : 'text-gray-400'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xs mt-1">邀请</span>
        </router-link>
        <router-link to="/profile" class="flex flex-col items-center py-2 px-4" :class="$route.path === '/profile' ? 'text-green-500' : 'text-gray-400'">
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
import { mockProducts, mockPointsRule } from '@/utils/mockData'

const store = useStore()
const user = computed(() => store.user)
const products = computed(() => mockProducts.filter(p => p.status === 'active'))
const pointsRule = mockPointsRule
const checkedIn = ref(false)

const handleCheckin = () => {
  if (checkedIn.value) return
  store.addPoints(pointsRule.daily_checkin, 'checkin')
  checkedIn.value = true
}
</script>
