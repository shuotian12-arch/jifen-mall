export interface User {
  user_id: string
  openid: string
  nickname: string
  avatar: string
  phone: string
  register_time: string
  points: number
  inviter_id: string | null
  has_first_checkin: boolean
}

export interface PointsRecord {
  record_id: string
  user_id: string
  type: 'register' | 'checkin' | 'invite' | 'redeem' | 'manual'
  value: number
  balance: number
  time: string
}

export interface Product {
  product_id: string
  name: string
  image: string
  points_required: number
  stock: number
  status: 'active' | 'inactive'
  expiry_date: string
}

export interface Redemption {
  redemption_id: string
  user_id: string
  product_id: string
  product_name: string
  points_used: number
  redemption_code: string
  status: 'pending' | 'redeemed' | 'expired'
  redeem_time: string
  redeem_deadline: string
  verify_time: string | null
}

export interface PointsRule {
  register_bonus: number
  daily_checkin: number
  invite_bonus: number
}

export interface Admin {
  admin_id: string
  username: string
  role: 'super' | 'operation' | 'service'
  status: 'active' | 'inactive'
  create_time: string
}