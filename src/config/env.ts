// 环境配置
// 设置为 true 使用本地模拟数据（开发阶段）
// 设置为 false 使用云开发数据（生产阶段）
export const USE_MOCK_DATA = false

// 云开发配置
export const CLOUD_CONFIG = {
  envId: 'cloud1-d7gzjvd9od83a6a37',
  region: 'ap-shanghai'
}

// 管理员信息（临时，后续应使用JWT）
export const ADMIN_INFO = {
  admin_id: 'admin001',
  username: 'admin',
  token: 'temp_token'
}