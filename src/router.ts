import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 用户端（小程序风格）
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/miniprogram/Home.vue'),
    meta: { platform: 'miniprogram' }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/pages/miniprogram/ProductDetail.vue'),
    meta: { platform: 'miniprogram' }
  },
  {
    path: '/points',
    name: 'PointsHistory',
    component: () => import('@/pages/miniprogram/PointsHistory.vue'),
    meta: { platform: 'miniprogram' }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/pages/miniprogram/Orders.vue'),
    meta: { platform: 'miniprogram' }
  },
  {
    path: '/invite',
    name: 'Invite',
    component: () => import('@/pages/miniprogram/Invite.vue'),
    meta: { platform: 'miniprogram' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/miniprogram/Profile.vue'),
    meta: { platform: 'miniprogram' }
  },
  // 管理员端（PC后台）
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/pages/admin/Dashboard.vue'),
    meta: { platform: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/pages/admin/Users.vue'),
    meta: { platform: 'admin' }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: () => import('@/pages/admin/Products.vue'),
    meta: { platform: 'admin' }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: () => import('@/pages/admin/Orders.vue'),
    meta: { platform: 'admin' }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('@/pages/admin/Settings.vue'),
    meta: { platform: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
