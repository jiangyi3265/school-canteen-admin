const DEFAULT_API_BASE = typeof window === 'undefined' ? 'http://127.0.0.1:8080' : '/dev-api'

export function apiBase() {
  try {
    const saved = typeof uni !== 'undefined' ? uni.getStorageSync('canteen-api-base') : localStorage.getItem('canteen-api-base')
    return String(saved || DEFAULT_API_BASE).replace(/\/$/, '')
  } catch {
    return DEFAULT_API_BASE
  }
}

export function setApiBase(value) {
  const base = String(value || '').trim().replace(/\/$/, '')
  if (base && !/^https?:\/\/[^\s]+$/i.test(base) && !/^\/(?!\/)[^\s]*$/.test(base)) throw new Error('请输入有效的服务地址')
  if (typeof uni !== 'undefined') uni.setStorageSync('canteen-api-base', base)
  else localStorage.setItem('canteen-api-base', base)
}

function unwrap(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('服务返回了无效数据')
  if (Number(payload.code) !== 200) throw new Error(payload.msg || '请求失败')
  return payload.data
}

function request(path, options = {}) {
  const url = apiBase() + path
  const method = options.method || 'GET'
  if (typeof uni !== 'undefined' && typeof uni.request === 'function') {
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        method,
        timeout: 10000,
        data: options.body,
        header: { 'content-type': 'application/json' },
        success(response) {
          try {
            if (response.statusCode < 200 || response.statusCode >= 300) throw new Error(`服务请求失败（${response.statusCode}）`)
            resolve(unwrap(response.data))
          } catch (error) { reject(error) }
        },
        fail(error) { reject(new Error(error.errMsg || '无法连接食堂服务')) }
      })
    })
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  return fetch(url, {
    signal: controller.signal,
    method,
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined
  }).then(async response => {
    if (!response.ok) throw new Error(`服务请求失败（${response.status}）`)
    return unwrap(await response.json())
  }).catch(error => { throw new Error(error.name === 'AbortError' ? '请求超时，请检查服务地址' : error.message) })
    .finally(() => clearTimeout(timer))
}

const query = params => Object.entries(params)
  .filter(([, value]) => value !== undefined && value !== null && value !== '')
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')

export const canteenApi = {
  health: () => request('/canteen/health'),
  bootstrap: (userId = 'student-001') => request(`/canteen/bootstrap?${query({ userId })}`),
  menus: (filters = {}) => request(`/canteen/menus?${query(filters)}`),
  updateMenu: (date, period, body) => request(`/canteen/menus/${encodeURIComponent(date)}/${encodeURIComponent(period)}`, { method: 'PUT', body }),
  orders: (filters = {}) => request(`/canteen/orders?${query(filters)}`),
  order: body => request('/canteen/orders', { method: 'POST', body }),
  stop: body => request('/canteen/stops', { method: 'POST', body }),
  teacherOrder: body => request('/canteen/teacher-orders', { method: 'POST', body }),
  daily: (date, period) => request(`/canteen/admin/daily?${query({ date, period })}`),
  monthly: (month, className, period) => request(`/canteen/admin/monthly?${query({ month, className: className || '全部班级', period })}`),
  classes: () => request('/canteen/admin/classes'),
  finance: () => request('/canteen/admin/finance'),
  roles: () => request('/canteen/admin/roles')
}
