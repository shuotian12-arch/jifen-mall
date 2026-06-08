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
        <router-link to="/admin/orders" class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          兑换管理
        </router-link>
        <router-link to="/admin/settings" class="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50 text-green-600">
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
      <h2 class="text-2xl font-bold text-gray-800 mb-6">基础设置</h2>

      <div class="bg-white rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4">积分规则配置</h3>
        <div class="space-y-6">
          <div>
            <label class="block text-sm text-gray-600 mb-2">新人注册奖励积分</label>
            <input
              v-model.number="rule.register_bonus"
              type="number"
              class="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p class="text-xs text-gray-400 mt-1">用户首次注册登录时赠送的积分</p>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-2">每日签到奖励积分</label>
            <input
              v-model.number="rule.daily_checkin"
              type="number"
              class="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p class="text-xs text-gray-400 mt-1">用户每日签到获得的积分，每人每天一次</p>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-2">邀请好友奖励积分</label>
            <input
              v-model.number="rule.invite_bonus"
              type="number"
              class="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p class="text-xs text-gray-400 mt-1">好友完成首次签到后，邀请人获得的积分</p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100">
          <button @click="handleSave" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            保存设置
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 mt-6">
        <h3 class="text-lg font-semibold mb-4">兑换规则</h3>
        <div class="space-y-3 text-sm text-gray-600">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>兑换后30天内有效，过期作废且积分不退</span>
          </div>
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>仅支持营业时间内到店核销</span>
          </div>
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>商品库存为0时显示"售罄"，商品仍在列表中可见，不自动下架</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockPointsRule } from '@/utils/mockData'

const rule = ref({ ...mockPointsRule })

const handleSave = () => {
  alert('设置已保存')
}
</script>