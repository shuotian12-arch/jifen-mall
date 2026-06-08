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
        <button @click="showTransferModal = true" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          积分转移
        </button>
      </div>

      <!-- 搜索栏 -->
      <div class="bg-white rounded-xl p-4 mb-6 flex items-center gap-4">
        <div class="flex-1">
          <input
            v-model="searchPhone"
            type="text"
            placeholder="输入手机号搜索"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select v-model="statusFilter" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">全部状态</option>
          <option value="active">正常</option>
          <option value="deleted">已注销</option>
        </select>
      </div>

      <!-- 用户表格 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">用户ID</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">昵称</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">手机号</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">OpenID</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">当前积分</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">注册时间</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">状态</th>
              <th class="text-left px-6 py-3 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.user_id" class="border-b border-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.user_id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="user.avatar" class="w-8 h-8 rounded-full" />
                  <span class="text-sm text-gray-800">{{ user.nickname }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.phone }}</td>
              <td class="px-6 py-4">
                <span class="text-xs text-gray-400 font-mono">{{ user.openid }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-orange-500 font-medium">{{ user.points }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.register_time }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded-full text-xs', user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500']">
                  {{ user.status === 'active' ? '正常' : '已注销' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="openPointsModal(user)"
                    class="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded hover:bg-gray-50"
                  >
                    调整积分
                  </button>
                  <button
                    @click="openDetailModal(user)"
                    class="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded hover:bg-gray-50"
                  >
                    详情
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 积分调整弹窗 -->
      <div v-if="showPointsModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showPointsModal = false">
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
            <button @click="showPointsModal = false" class="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600">
              取消
            </button>
            <button @click="handlePointsChange" class="flex-1 py-2 bg-green-500 text-white rounded-lg">
              确认
            </button>
          </div>
        </div>
      </div>

      <!-- 用户详情弹窗 -->
      <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showDetailModal = false">
        <div class="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto" @click.stop>
          <h3 class="text-lg font-semibold mb-4">用户详情 - {{ selectedUser?.nickname }}</h3>

          <!-- 基本信息 -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="text-sm text-gray-500">用户ID</label>
              <p class="text-gray-800">{{ selectedUser?.user_id }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">手机号</label>
              <p class="text-gray-800">{{ selectedUser?.phone }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">OpenID</label>
              <p class="text-gray-800 font-mono text-sm">{{ selectedUser?.openid }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">当前积分</label>
              <p class="text-orange-500 font-medium">{{ selectedUser?.points }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">注册时间</label>
              <p class="text-gray-800">{{ selectedUser?.register_time }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">状态</label>
              <p :class="selectedUser?.status === 'active' ? 'text-green-500' : 'text-gray-500'">
                {{ selectedUser?.status === 'active' ? '正常' : '已注销' }}
              </p>
            </div>
          </div>

          <!-- 兑换记录 -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">兑换记录</h4>
            <div v-if="userRedemptions.length === 0" class="text-center text-gray-400 py-4">
              暂无兑换记录
            </div>
            <div v-else class="space-y-2">
              <div v-for="r in userRedemptions" :key="r.redemption_id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ r.product_name }}</p>
                  <p class="text-xs text-gray-500">{{ r.redeem_time }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-orange-500">-{{ r.points_used }}</p>
                  <span :class="['text-xs px-2 py-0.5 rounded', r.status === 'pending' ? 'bg-orange-100 text-orange-600' : r.status === 'redeemed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500']">
                    {{ r.status === 'pending' ? '待核销' : r.status === 'redeemed' ? '已核销' : '已过期' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button @click="showDetailModal = false" class="w-full mt-4 py-2 bg-gray-100 rounded-lg text-gray-600">
            关闭
          </button>
        </div>
      </div>

      <!-- 积分转移弹窗 -->
      <div v-if="showTransferModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showTransferModal = false">
        <div class="bg-white rounded-xl p-6 w-[500px]" @click.stop>
          <h3 class="text-lg font-semibold mb-4">积分转移</h3>

          <div v-if="transferStep === 1" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-2">旧手机号（源账号）</label>
              <input
                v-model="fromPhone"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="输入旧手机号"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-2">新手机号（目标账号）</label>
              <input
                v-model="toPhone"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="输入新手机号"
              />
            </div>
            <button @click="handleSearchTransfer" class="w-full py-2 bg-green-500 text-white rounded-lg">
              下一步
            </button>
          </div>

          <div v-else-if="transferStep === 2" class="space-y-4">
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p class="text-sm font-medium text-orange-800 mb-2">确认转移信息</p>
              <div class="space-y-2 text-sm">
                <p><span class="text-gray-500">源账号：</span>{{ fromUser?.phone }}（积分：{{ fromUser?.points }}）</p>
                <p><span class="text-gray-500">目标账号：</span>{{ toUser?.phone }}（积分：{{ toUser?.points }}）</p>
                <p class="text-orange-600 font-medium">转移积分：{{ fromUser?.points }}</p>
              </div>
            </div>
            <p class="text-xs text-gray-500">
              转移后：
            </p>
            <ul class="text-xs text-gray-500 list-disc list-inside">
              <li>源账号积分清零并标记为「已注销」</li>
              <li>目标账号积分增加{{ fromUser?.points }}</li>
              <li>源账号的所有历史积分记录和兑换记录将转移到目标账号</li>
            </ul>
            <div class="flex gap-3">
              <button @click="transferStep = 1" class="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600">
                返回
              </button>
              <button @click="handleConfirmTransfer" class="flex-1 py-2 bg-orange-500 text-white rounded-lg">
                确认转移
              </button>
            </div>
          </div>

          <div v-else-if="transferStep === 3" class="text-center py-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-gray-800 font-medium">积分转移成功</p>
            <button @click="showTransferModal = false; resetTransfer()" class="mt-4 w-full py-3 bg-gray-100 rounded-xl text-gray-600">
              关闭
            </button>
          </div>

          <button v-if="transferStep !== 3" @click="showTransferModal = false; resetTransfer()" class="mt-4 w-full py-2 text-gray-400 text-sm">
            取消
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/store'
import type { User, Redemption } from '@/types'

const store = useStore()
const users = computed(() => store.users)
const searchPhone = ref('')
const statusFilter = ref('')

const showPointsModal = ref(false)
const showDetailModal = ref(false)
const showTransferModal = ref(false)
const selectedUser = ref<User | null>(null)
const pointsChange = ref('')
const reason = ref('')

const transferStep = ref(1)
const fromPhone = ref('')
const toPhone = ref('')
const fromUser = ref<User | null>(null)
const toUser = ref<User | null>(null)

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchPhone = !searchPhone.value || user.phone.includes(searchPhone.value)
    const matchStatus = !statusFilter.value || user.status === statusFilter.value
    return matchPhone && matchStatus
  })
})

const userRedemptions = computed(() => {
  if (!selectedUser.value) return []
  return store.getUserRedemptions(selectedUser.value.user_id)
})

const openPointsModal = (user: User) => {
  selectedUser.value = user
  pointsChange.value = ''
  reason.value = ''
  showPointsModal.value = true
}

const openDetailModal = (user: User) => {
  selectedUser.value = user
  showDetailModal.value = true
}

const handlePointsChange = () => {
  if (!selectedUser.value || !pointsChange.value) return
  const change = parseInt(pointsChange.value)
  store.adjustUserPoints(selectedUser.value.user_id, change, reason.value)
  const user = users.value.find(u => u.user_id === selectedUser.value?.user_id)
  if (user) user.points += change
  showPointsModal.value = false
}

const resetTransfer = () => {
  transferStep.value = 1
  fromPhone.value = ''
  toPhone.value = ''
  fromUser.value = null
  toUser.value = null
}

const handleSearchTransfer = () => {
  if (!fromPhone.value || !toPhone.value) {
    alert('请输入两个手机号')
    return
  }

  fromUser.value = users.value.find(u => u.phone === fromPhone.value)
  toUser.value = users.value.find(u => u.phone === toPhone.value)

  if (!fromUser.value) {
    alert('未找到源账号')
    return
  }
  if (!toUser.value) {
    alert('未找到目标账号')
    return
  }
  if (fromUser.value.user_id === toUser.value.user_id) {
    alert('不能转移到自己')
    return
  }
  if (fromUser.value.status === 'deleted') {
    alert('源账号已注销')
    return
  }
  if (toUser.value.status === 'deleted') {
    alert('目标账号已注销')
    return
  }

  transferStep.value = 2
}

const handleConfirmTransfer = () => {
  if (!fromUser.value || !toUser.value) return

  if (!confirm(`确认将 ${fromUser.value.phone} 的 ${fromUser.value.points} 积分转移到 ${toUser.value.phone}？`)) {
    return
  }

  const result = store.transferPoints(fromUser.value.user_id, toUser.value.user_id)

  if (result.success) {
    transferStep.value = 3
  } else {
    alert(result.message)
  }
}
</script>