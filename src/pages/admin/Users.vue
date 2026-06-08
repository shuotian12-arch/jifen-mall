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
        <router-link to="/admin/users" class="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50 text-green-600">
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
        <router-link to="/admin/orders" class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
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
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">用户管理</h2>
      </div>

      <!-- 用户表格 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">用户ID</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">昵称</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">手机号</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">当前积分</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">注册时间</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.user_id" class="border-b border-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.user_id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="user.avatar" class="w-8 h-8 rounded-full" />
                  <span class="text-sm text-gray-800">{{ user.nickname }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.phone }}</td>
              <td class="px-6 py-4">
                <span class="text-orange-500 font-medium">{{ user.points }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.register_time }}</td>
              <td class="px-6 py-4">
                <button
                  @click="openPointsModal(user)"
                  class="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded hover:bg-gray-50"
                >
                  调整积分
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 积分调整弹窗 -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showModal = false">
        <div class="bg-white rounded-xl p-6 w-96" @click.stop>
          <h3 class="text-lg font-semibold mb-4">调整积分 - {{ selectedUser?.nickname }}</h3>
          <div class="mb-4">
            <label class="block text-sm text-gray-600 mb-2">当前积分</label>
            <div class="text-2xl font-bold text-orange-500">{{ selectedUser?.points }}</div>
          </div>
          <div class="mb-4">
            <label class="block text-sm text-gray-600 mb-2">变动值（正数增加，负数减少）</label>
            <input
              v-model="pointsChange"
              type="number"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="例如：10 或 -10"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm text-gray-600 mb-2">备注</label>
            <input
              v-model="reason"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="变动原因"
            />
          </div>
          <div class="flex gap-3">
            <button @click="showModal = false" class="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600">
              取消
            </button>
            <button @click="handlePointsChange" class="flex-1 py-2 bg-green-500 text-white rounded-lg">
              确认
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store'
import type { User } from '@/types'

const store = useStore()
const users = ref<User[]>([
  {
    user_id: 'u001',
    openid: 'wx_001',
    nickname: '微信用户',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    phone: '138****8888',
    register_time: '2026-06-01 10:00:00',
    points: 250,
    inviter_id: null,
    has_first_checkin: true
  },
  {
    user_id: 'u002',
    openid: 'wx_002',
    nickname: '小明',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    phone: '139****9999',
    register_time: '2026-06-03 15:20:00',
    points: 160,
    inviter_id: 'u001',
    has_first_checkin: true
  }
])

const showModal = ref(false)
const selectedUser = ref<User | null>(null)
const pointsChange = ref('')
const reason = ref('')

const openPointsModal = (user: User) => {
  selectedUser.value = user
  pointsChange.value = ''
  reason.value = ''
  showModal.value = true
}

const handlePointsChange = () => {
  if (!selectedUser.value || !pointsChange.value) return
  const change = parseInt(pointsChange.value)
  store.adjustUserPoints(selectedUser.value.user_id, change, reason.value)
  selectedUser.value.points += change
  showModal.value = false
}
</script>