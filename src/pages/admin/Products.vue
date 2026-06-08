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
        <router-link to="/admin/products" class="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50 text-green-600">
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
        <h2 class="text-2xl font-bold text-gray-800">商品管理</h2>
        <button @click="openProductModal()" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          添加商品
        </button>
      </div>

      <!-- 商品列表 -->
      <div class="grid grid-cols-3 gap-6">
        <div v-for="product in products" :key="product.product_id" class="bg-white rounded-xl shadow-sm overflow-hidden">
          <img :src="product.image" class="w-full h-48 object-cover" />
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-800">{{ product.name }}</h3>
              <span :class="['px-2 py-1 rounded-full text-xs', product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500']">
                {{ product.status === 'active' ? '上架' : '下架' }}
              </span>
            </div>
            <div class="space-y-1 text-sm text-gray-500">
              <div class="flex justify-between">
                <span>所需积分</span>
                <span class="text-orange-500 font-medium">{{ product.points_required }}</span>
              </div>
              <div class="flex justify-between">
                <span>库存</span>
                <span :class="product.stock === 0 ? 'text-red-500' : ''">{{ product.stock }}</span>
              </div>
              <div class="flex justify-between">
                <span>有效期</span>
                <span>{{ product.expiry_date }}</span>
              </div>
            </div>
            <div class="flex gap-2 mt-4">
              <button @click="openProductModal(product)" class="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
                编辑
              </button>
              <button
                @click="toggleProductStatus(product)"
                class="flex-1 py-2 rounded-lg"
                :class="product.status === 'active' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-500 text-white hover:bg-green-600'"
              >
                {{ product.status === 'active' ? '下架' : '上架' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品编辑弹窗 -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showModal = false">
        <div class="bg-white rounded-xl p-6 w-[500px]" @click.stop>
          <h3 class="text-lg font-semibold mb-4">{{ editingProduct ? '编辑商品' : '添加商品' }}</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-2">商品名称</label>
              <input v-model="productForm.name" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-2">图片URL</label>
              <input v-model="productForm.image" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-600 mb-2">所需积分</label>
                <input v-model.number="productForm.points_required" type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-2">库存</label>
                <input v-model.number="productForm.stock" type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-2">有效期</label>
              <input v-model="productForm.expiry_date" type="date" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button @click="showModal = false" class="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600">
              取消
            </button>
            <button @click="handleProductSubmit" class="flex-1 py-2 bg-green-500 text-white rounded-lg">
              保存
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { mockProducts } from '@/utils/mockData'
import type { Product } from '@/types'

const products = ref<Product[]>(mockProducts)
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)

const productForm = reactive({
  name: '',
  image: '',
  points_required: 0,
  stock: 0,
  expiry_date: ''
})

const openProductModal = (product?: Product) => {
  editingProduct.value = product || null
  if (product) {
    productForm.name = product.name
    productForm.image = product.image
    productForm.points_required = product.points_required
    productForm.stock = product.stock
    productForm.expiry_date = product.expiry_date
  } else {
    productForm.name = ''
    productForm.image = ''
    productForm.points_required = 0
    productForm.stock = 0
    productForm.expiry_date = ''
  }
  showModal.value = true
}

const toggleProductStatus = (product: Product) => {
  product.status = product.status === 'active' ? 'inactive' : 'active'
}

const handleProductSubmit = () => {
  if (editingProduct.value) {
    Object.assign(editingProduct.value, productForm)
  } else {
    products.value.push({
      product_id: `p${Date.now()}`,
      ...productForm,
      status: 'active'
    })
  }
  showModal.value = false
}
</script>