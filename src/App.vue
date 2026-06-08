<template>
  <div id="app">
    <!-- 平台切换 -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white px-4 py-2 flex items-center justify-between text-sm">
      <span>积分商城系统 - 前端演示</span>
      <div class="flex items-center gap-2">
        <button
          @click="switchPlatform('miniprogram')"
          :class="['px-3 py-1 rounded', currentPlatform === 'miniprogram' ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500']"
        >
          用户端（小程序）
        </button>
        <button
          @click="switchPlatform('admin')"
          :class="['px-3 py-1 rounded', currentPlatform === 'admin' ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500']"
        >
          管理员端（PC后台）
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="pt-10">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentPlatform = computed(() => route.meta.platform as string || 'miniprogram')

const switchPlatform = (platform: 'miniprogram' | 'admin') => {
  if (platform === 'miniprogram') {
    router.push('/')
  } else {
    router.push('/admin')
  }
}
</script>
