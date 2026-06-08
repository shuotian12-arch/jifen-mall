<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 侧边栏 -->
    <aside class="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-gray-200">
      <div class="p-4 border-b border-gray-100">
        <h1 class="text-xl font-bold text-gray-800">积分商城后台</h1>
        <p class="text-sm text-gray-500 mt-1">管理系统</p>
      </div>
      <nav class="p-4 space-y-1">
        <router-link
          to="/admin"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          :class="$route.path === '/admin' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M3 20a2 2 0 002-2v-2a2 2 0 00-2 2v2a2 2 0 002 2z" />
          </svg>
          首页
        </router-link>
        <router-link
          to="/admin/users"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          :class="$route.path === '/admin/users' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          用户管理
        </router-link>
        <router-link
          to="/admin/products"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          :class="$route.path === '/admin/products' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          商品管理
        </router-link>
        <router-link
          to="/admin/orders"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          :class="$route.path === '/admin/orders' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          兑换管理
        </router-link>
        <router-link
          to="/admin/settings"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          :class="$route.path === '/admin/settings' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          基础设置
        </router-link>
      </nav>
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
            {{ admin.username[0].toUpperCase() }}
          </div>
          <div>
            <div class="text-sm font-medium text-gray-800">{{ admin.username }}</div>
            <div class="text-xs text-gray-500">{{ roleLabels[admin.role] }}</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="ml-56 p-8">
      <!-- 统计卡片 -->
      <h2 class="text-2xl font-bold text-gray-800 mb-6">数据概览</h2>
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-gray-500 text-sm mb-2">总用户数</div>
          <div class="text-3xl font-bold text-gray-800">{{ stats.totalUsers }}</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-gray-500 text-sm mb-2">总兑换数</div>
          <div class="text-3xl font-bold text-gray-800">{{ stats.totalRedemptions }}</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-gray-500 text-sm mb-2">待核销订单</div>
          <div class="text-3xl font-bold text-orange-500">{{ stats.pendingRedemptions }}</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-gray-500 text-sm mb-2">商品总数</div>
          <div class="text-3xl font-bold text-gray-800">{{ stats.totalProducts }}</div>
        </div>
      </div>

      <!-- 最近订单 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800">最近兑换订单</h3>
          <router-link to="/admin/orders" class="text-green-500 text-sm hover:underline">查看全部</router-link>
        </div>
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">订单号</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">商品</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">用户</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">状态</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.redemption_id" class="border-b border-gray-50">
              <td class="px-6 py-4 text-sm text-gray-800">{{ order.redemption_code }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ order.product_name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ order.user_id }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded-full text-xs', statusStyles[order.status]]">
                  {{ statusLabels[order.status] }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  v-if="order.status === 'pending'"
                  @click="handleVerify(order)"
                  class="px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  核销
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store'
import { mockAdmins } from '@/utils/mockData'
import type { Redemption } from '@/types'

const store = useStore()
const admin = mockAdmins[0]

const stats = ref({
  totalUsers: 128,
  totalRedemptions: 342,
  pendingRedemptions: 23,
  totalProducts: 5
})

const recentOrders = ref<Redemption[]>([...store.redemptions].slice(0, 5))

const roleLabels: Record<string, string> = {
  super: '超级管理员',
  operation: '运营',
  service: '客服'
}

const statusLabels: Record<string, string> = {
  pending: '待核销',
  redeemed: '已核销',
  expired: '已过期'
}

const statusStyles: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-600',
  redeemed: 'bg-green-100 text-green-600',
  expired: 'bg-red-100 text-red-500'
}

const handleVerify = (order: Redemption) => {
  store.verifyRedemption(order.redemption_id)
  recentOrders.value = [...store.redemptions].slice(0, 5)
  stats.value.pendingRedemptions--
}
</script>