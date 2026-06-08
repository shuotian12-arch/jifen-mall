<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 顶部导航 -->
    <div class="bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button @click="$router.back()" class="w-8 h-8 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">兑换记录</h1>
        <div class="w-8"></div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="p-4 space-y-3">
      <div v-if="redemptions.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-gray-400">暂无兑换记录</p>
      </div>

      <div
        v-for="item in redemptions"
        :key="item.redemption_id"
        class="bg-white rounded-xl p-4"
        @click="showCode(item)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="font-medium text-gray-800">{{ item.product_name }}</div>
            <div class="text-sm text-gray-400 mt-1">
              消耗 {{ item.points_used }} 积分
            </div>
            <div class="text-xs text-gray-400 mt-1">
              兑换时间: {{ item.redeem_time }}
            </div>
          </div>
          <div :class="['px-3 py-1 rounded-full text-xs', statusStyles[item.status]]">
            {{ statusLabels[item.status] }}
          </div>
        </div>
      </div>
    </div>

    <!-- 核销码弹窗 -->
    <div v-if="selectedRedemption" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click="selectedRedemption = null">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm" @click.stop>
        <h3 class="text-center font-semibold text-gray-800 mb-4">{{ selectedRedemption.product_name }}</h3>
        <div class="bg-gray-50 rounded-xl p-4 text-center">
          <div ref="qrcodeRef" class="inline-block mb-3"></div>
          <div class="text-2xl font-mono font-bold text-gray-800">{{ selectedRedemption.redemption_code }}</div>
        </div>
        <div class="mt-4 text-center text-sm text-gray-500">
          <p>请在 {{ selectedRedemption.redeem_deadline }} 前到店核销</p>
          <p class="text-orange-500 mt-1">过期作废，积分不退</p>
        </div>
        <button @click="selectedRedemption = null" class="w-full mt-4 py-3 bg-gray-100 rounded-xl text-gray-600">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useStore } from '@/store'
import type { Redemption } from '@/types'
import QRCode from 'qrcode'

const store = useStore()
const redemptions = computed(() => store.redemptions)
const selectedRedemption = ref<Redemption | null>(null)
const qrcodeRef = ref<HTMLElement | null>(null)

const statusLabels: Record<Redemption['status'], string> = {
  pending: '待核销',
  redeemed: '已核销',
  expired: '已过期'
}

const statusStyles: Record<Redemption['status'], string> = {
  pending: 'bg-green-100 text-green-600',
  redeemed: 'bg-gray-100 text-gray-500',
  expired: 'bg-red-100 text-red-500'
}

const showCode = async (item: Redemption) => {
  if (item.status !== 'pending') return
  selectedRedemption.value = item
  await nextTick()
  if (qrcodeRef.value) {
    QRCode.toCanvas(item.redemption_code, { width: 160 }, (err, canvas) => {
      if (!err && qrcodeRef.value) {
        qrcodeRef.value.innerHTML = ''
        qrcodeRef.value.appendChild(canvas)
      }
    })
  }
}
</script>
