// 环境配置
// 设置为 true 使用本地模拟数据（开发阶段）
// 设置为 false 使用云开发数据（生产阶段）
export const USE_MOCK_DATA = true

// 云开发配置
export const CLOUD_CONFIG = {
  envId: 'jifen-mall-xxx', // 替换为你的云开发环境ID
  region: 'ap-shanghai'
}

// 管理员信息（临时，后续应使用JWT）
export const ADMIN_INFO = {
  admin_id: 'admin001',
  username: 'admin',
  token: 'temp_token'
}