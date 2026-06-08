<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 侧边栏 -->
    <aside class="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-gray-200">
      <div class="p-4 border-b border-gray-100">
        <h1 class="text-xl font-bold text-gray-800">积分商城后台</h1>
        <p class="text-sm text-gray-500 mt-1">管理系统</p>
      </div>
      <nav class="p-4 space-y-1">
        <router-link to="/admin" class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M3 20a2 2 0 002-2v-2a2 2 0 00-2 2v2a2 2 0 002 2z" />
          </svg>
          首页
        </router-link>
        <router-link to="/admin/users" class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          用户管理
        </router-link>
        <router-link to="/admin/products" class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          商品管理
        </router-link>
        <router-link to="/admin/orders" class="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50 text-green-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          兑换管理
        </router-link>
        <router-link to="/admin/settings" class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          基础设置
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="ml-56 p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">兑换管理</h2>

      <!-- 筛选 -->
      <div class="bg-white rounded-xl p-4 mb-6 flex items-center gap-4">
        <div class="flex-1">
          <input
            v-model="searchCode"
            type="text"
            placeholder="输入核销码搜索"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select v-model="statusFilter" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">全部状态</option>
          <option value="pending">待核销</option>
          <option value="redeemed">已核销</option>
          <option value="expired">已过期</option>
        </select>
        <button @click="showVerifyModal = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          输入核销码
        </button>
      </div>

      <!-- 订单表格 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">核销码</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">商品</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">用户ID</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">消耗积分</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">兑换时间</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">有效期</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">状态</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.redemption_id" class="border-b border-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ order.redemption_code }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ order.product_name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ order.user_id }}</td>
              <td class="px-6 py-4 text-sm text-orange-500">{{ order.points_used }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ order.redeem_time }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ order.redeem_deadline }}</td>
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

      <!-- 核销码输入弹窗 -->
      <div v-if="showVerifyModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showVerifyModal = false">
        <div class="bg-white rounded-xl p-6 w-[400px]" @click.stop>
          <h3 class="text-lg font-semibold mb-4">输入核销码</h3>
          <input
            v-model="manualCode"
            type="text"
            placeholder="请输入核销码"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />
          <div class="flex gap-3">
            <button @click="showVerifyModal = false" class="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600">
              取消
            </button>
            <button @click="handleManualVerify" class="flex-1 py-2 bg-green-500 text-white rounded-lg">
              确认核销
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/store'
import type { Redemption } from '@/types'

const store = useStore()
const redemptions = ref<Redemption[]>([...store.redemptions])
const searchCode = ref('')
const statusFilter = ref('')
const showVerifyModal = ref(false)
const manualCode = ref('')

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

const filteredOrders = computed(() => {
  return redemptions.value.filter(order => {
    const matchCode = !searchCode.value || order.redemption_code.includes(searchCode.value)
    const matchStatus = !statusFilter.value || order.status === statusFilter.value
    return matchCode && matchStatus
  })
})

const handleVerify = (order: Redemption) => {
  if (confirm(`确认核销订单 ${order.redemption_code}？`)) {
    store.verifyRedemption(order.redemption_id)
    const index = redemptions.value.findIndex(r => r.redemption_id === order.redemption_id)
    if (index !== -1) {
      redemptions.value[index].status = 'redeemed'
      redemptions.value[index].verify_time = new Date().toISOString()
    }
  }
}

const handleManualVerify = () => {
  const order = redemptions.value.find(r => r.redemption_code === manualCode.value)
  if (order) {
    if (order.status !== 'pending') {
      alert('该订单已核销或已过期')
      return
    }
    handleVerify(order)
    showVerifyModal.value = false
    manualCode.value = ''
  } else {
    alert('未找到该核销码')
  }
}
</script>