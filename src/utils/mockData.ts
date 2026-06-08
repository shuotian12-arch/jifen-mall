import type { User, PointsRecord, Product, Redemption, PointsRule, Admin } from '../types'

export const mockUser: User = {
  user_id: 'u001',
  openid: 'wx_openid_001',
  nickname: '微信用户',
  avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
  phone: '138****8888',
  register_time: '2026-06-01 10:00:00',
  points: 250,
  inviter_id: null,
  has_first_checkin: true
}

export const mockPointsRecords: PointsRecord[] = [
  {
    record_id: 'r001',
    user_id: 'u001',
    type: 'register',
    value: 100,
    balance: 100,
    time: '2026-06-01 10:00:00'
  },
  {
    record_id: 'r002',
    user_id: 'u001',
    type: 'checkin',
    value: 10,
    balance: 110,
    time: '2026-06-02 09:30:00'
  },
  {
    record_id: 'r003',
    user_id: 'u001',
    type: 'invite',
    value: 50,
    balance: 160,
    time: '2026-06-03 15:20:00'
  },
  {
    record_id: 'r004',
    user_id: 'u001',
    type: 'checkin',
    value: 10,
    balance: 170,
    time: '2026-06-04 08:45:00'
  },
  {
    record_id: 'r005',
    user_id: 'u001',
    type: 'checkin',
    value: 10,
    balance: 180,
    time: '2026-06-05 09:10:00'
  },
  {
    record_id: 'r006',
    user_id: 'u001',
    type: 'checkin',
    value: 10,
    balance: 190,
    time: '2026-06-06 08:30:00'
  },
  {
    record_id: 'r007',
    user_id: 'u001',
    type: 'checkin',
    value: 10,
    balance: 200,
    time: '2026-06-07 09:00:00'
  },
  {
    record_id: 'r008',
    user_id: 'u001',
    type: 'checkin',
    value: 10,
    balance: 210,
    time: '2026-06-08 08:15:00'
  },
  {
    record_id: 'r009',
    user_id: 'u001',
    type: 'invite',
    value: 50,
    balance: 260,
    time: '2026-06-08 14:30:00'
  },
  {
    record_id: 'r010',
    user_id: 'u001',
    type: 'redeem',
    value: -10,
    balance: 250,
    time: '2026-06-08 15:00:00'
  }
]

export const mockProducts: Product[] = [
  {
    product_id: 'p001',
    name: '精美咖啡杯',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
    points_required: 100,
    stock: 50,
    status: 'active',
    expiry_date: '2026-12-31'
  },
  {
    product_id: 'p002',
    name: '定制笔记本',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
    points_required: 50,
    stock: 0,
    status: 'active',
    expiry_date: '2026-12-31'
  },
  {
    product_id: 'p003',
    name: '便携充电宝',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    points_required: 200,
    stock: 30,
    status: 'active',
    expiry_date: '2026-12-31'
  },
  {
    product_id: 'p004',
    name: '蓝牙耳机',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    points_required: 500,
    stock: 15,
    status: 'active',
    expiry_date: '2026-12-31'
  },
  {
    product_id: 'p005',
    name: '旅行背包',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    points_required: 300,
    stock: 20,
    status: 'active',
    expiry_date: '2026-12-31'
  }
]

export const mockRedemptions: Redemption[] = [
  {
    redemption_id: 'red001',
    user_id: 'u001',
    product_id: 'p001',
    product_name: '精美咖啡杯',
    points_used: 100,
    redemption_code: 'RM20260601001',
    status: 'pending',
    redeem_time: '2026-06-01 10:30:00',
    redeem_deadline: '2026-07-01 10:30:00',
    verify_time: null
  },
  {
    redemption_id: 'red002',
    user_id: 'u001',
    product_id: 'p005',
    product_name: '旅行背包',
    points_used: 300,
    redemption_code: 'RM20260605001',
    status: 'redeemed',
    redeem_time: '2026-06-05 14:00:00',
    redeem_deadline: '2026-07-05 14:00:00',
    verify_time: '2026-06-06 16:30:00'
  }
]

export const mockPointsRule: PointsRule = {
  register_bonus: 100,
  daily_checkin: 10,
  invite_bonus: 50
}

export const mockAdmins: Admin[] = [
  {
    admin_id: 'a001',
    username: 'admin',
    role: 'super',
    status: 'active',
    create_time: '2026-05-01 10:00:00'
  }
]