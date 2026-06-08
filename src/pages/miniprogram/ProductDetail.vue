<template>
  <div class="min-h-screen bg-gray-50 pb-4">
    <!-- 顶部导航 -->
    <div class="bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button @click="$router.back()" class="w-8 h-8 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">商品详情</h1>
        <div class="w-8"></div>
      </div>
    </div>

    <!-- 商品图片 -->
    <img :src="product?.image" class="w-full aspect-square object-cover bg-white" />

    <!-- 商品信息 -->
    <div class="bg-white p-4 mt-2">
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-bold text-orange-500">{{ product?.points_required }}</span>
        <span class="text-sm text-orange-500">积分</span>
      </div>
      <h2 class="text-lg font-semibold text-gray-800 mt-2">{{ product?.name }}</h2>
      <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
        <span>库存: {{ product?.stock }}件</span>
        <span>有效期至: {{ product?.expiry_date }}</span>
      </div>
    </div>

    <!-- 兑换说明 -->
    <div class="bg-white p-4 mt-2">
      <h3 class="font-medium text-gray-800 mb-3">兑换说明</h3>
      <ul class="text-sm text-gray-600 space-y-2">
        <li class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
          兑换后30天内有效，过期作废且积分不退
        </li>
        <li class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
          请在营业时间内到店核销
        </li>
        <li class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
          每人限兑换一次
        </li>
      </ul>
    </div>

    <!-- 底部按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom">
      <button
        @click="handleRedeem"
        :disabled="!canRedeem"
        :class="[
          'w-full py-3 rounded-xl font-medium text-white',
          canRedeem ? 'bg-green-500 active:bg-green-600' : 'bg-gray-300'
        ]"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { mockProducts } from '@/utils/mockData'

const route = useRoute()
const router = useRouter()
const store = useStore()

const product = computed(() => mockProducts.find(p => p.product_id === route.params.id))
const user = computed(() => store.user)

const canRedeem = computed(() => {
  if (!product.value) return false
  if (product.value.stock === 0) return false
  if (user.value.points < product.value.points_required) return false
  return true
})

const buttonText = computed(() => {
  if (!product.value) return '商品不存在'
  if (product.value.stock === 0) return '已售罄'
  if (user.value.points < product.value.points_required) return '积分不足'
  return '立即兑换'
})

const handleRedeem = () => {
  if (!canRedeem.value || !product.value) return

  const redemptionId = `red${Date.now()}`
  const code = `RM${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.random().toString(36).slice(2, 5).toUpperCase()}`

  store.redeemProduct({
    redemption_id: redemptionId,
    product_id: product.value.product_id,
    product_name: product.value.name,
    points_used: product.value.points_required,
    redemption_code: code
  })

  router.push('/orders')
}
</script>
