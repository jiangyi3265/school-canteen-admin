export const mealPeriods = [
  { key: 'lunch', label: '午餐' },
  { key: 'snack', label: '午点' },
  { key: 'dinner', label: '晚餐' }
]

export const weekMenus = [
  { day: '周一', date: '2025-05-12', art: 'monday', name: '红烧排骨套餐', dishes: ['红烧排骨', '时蔬炒菌', '冬瓜汤'] },
  { day: '周二', date: '2025-05-13', art: 'tuesday', name: '红烧鸡翅套餐', dishes: ['红烧鸡翅', '清炒时蔬', '米饭', '冬瓜汤'] },
  { day: '周三', date: '2025-05-14', art: 'wednesday', name: '番茄炒蛋套餐', dishes: ['番茄炒蛋', '蒸南瓜', '绿豆汤'] },
  { day: '周四', date: '2025-05-15', art: 'thursday', name: '土豆牛腩套餐', dishes: ['土豆牛腩', '炒青菜', '玉米汤'] },
  { day: '周五', date: '2025-05-16', art: 'friday', name: '香菇滑鸡套餐', dishes: ['香菇滑鸡', '炒时蔬', '海带汤'] }
]

export function menuFor(date, period, teacher = false) {
  if (period === 'snack') return { name: '营养午点', dishes: ['鲜牛奶', '松软小面包', '时令水果'], art: 'diet', description: '一份午点，补充午后好能量', price: 6 }
  if (period === 'dinner') return { name: '番茄鸡蛋套餐', dishes: ['番茄炒蛋', '清炒时蔬', '米饭', '紫菜蛋花汤'], art: 'wednesday', description: '荤素搭配，营养好滋味', price: 15 }
  if (teacher) return { name: '土豆牛腩套餐', dishes: ['土豆牛肉', '炒青菜', '米饭', '玉米汤'], art: 'beef', description: '营养均衡，美味可口', price: 18 }
  const menu = weekMenus.find(item => item.date === date) || weekMenus[1]
  return { ...menu, art: date === '2025-05-13' ? 'lunch' : menu.art, description: '营养均衡，美味可口', price: 18 }
}

export const stopReasons = [
  { key: 'personal', title: '事假停餐', description: '因事请假，需申请停餐。' },
  { key: 'sick', title: '病假停餐', description: '因病请假，需申请停餐。' },
  { key: 'outing', title: '外出活动', description: '学校组织外出活动期间。' },
  { key: 'school', title: '临时停课', description: '学校临时通知停课。' },
  { key: 'transfer', title: '转学离校', description: '转学或离校，不在校就餐。' },
  { key: 'holiday', title: '长期请假', description: '连续请假或长期停餐。' },
  { key: 'diet', title: '特殊饮食', description: '饮食禁忌或特殊需求。' },
  { key: 'other', title: '其他原因', description: '其他需要停餐的情况。' }
]

export const initialOrders = [
  { id: 'demo-1', date: '2025-05-12', period: 'lunch', name: '红烧排骨套餐', status: 'ordered' },
  { id: 'demo-2', date: '2025-05-12', period: 'dinner', name: '番茄炒蛋套餐', status: 'ordered' },
  { id: 'demo-3', date: '2025-05-13', period: 'lunch', name: '土豆牛肉套餐', status: 'stopped' },
  { id: 'demo-4', date: '2025-05-13', period: 'dinner', name: '番茄炒蛋套餐', status: 'stopped' },
  { id: 'demo-5', date: '2025-05-14', period: 'lunch', name: '宫保鸡丁套餐', status: 'ordered' }
]

export const classStats = [
  { name: '一年级1班', ordered: 36, stopped: 2, snack: 34, total: 820 },
  { name: '一年级2班', ordered: 35, stopped: 1, snack: 34, total: 760 },
  { name: '二年级1班', ordered: 38, stopped: 3, snack: 35, total: 715 },
  { name: '二年级2班', ordered: 37, stopped: 2, snack: 35, total: 690 },
  { name: '三年级1班', ordered: 40, stopped: 4, snack: 36, total: 655 },
  { name: '三年级2班', ordered: 39, stopped: 3, snack: 36, total: 610 }
]

export function readOrders() {
  try {
    const value = typeof uni !== 'undefined' ? uni.getStorageSync('canteen-demo-orders-v1') : localStorage.getItem('canteen-demo-orders-v1')
    const parsed = typeof value === 'string' && value ? JSON.parse(value) : value
    if (Array.isArray(parsed)) return parsed
  } catch { /* Storage can be disabled; keep the interface usable in memory. */ }
  return initialOrders.map(item => ({ ...item }))
}

export function saveOrders(orders) {
  try {
    if (typeof uni !== 'undefined') uni.setStorageSync('canteen-demo-orders-v1', JSON.stringify(orders))
    else localStorage.setItem('canteen-demo-orders-v1', JSON.stringify(orders))
    return true
  } catch { return false }
}

export function upsertOrder(orders, record) {
  return [{ ...record, id: `${record.date}-${record.period}` }, ...orders.filter(item => !(item.date === record.date && item.period === record.period))]
}
