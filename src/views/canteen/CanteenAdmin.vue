<template>
  <div class="canteen-admin" :class="[{ 'admin-showcase': showcase }, 'admin-' + view]">
    <aside class="canteen-sidebar" aria-label="食堂管理导航">
      <div v-if="!showcase" class="admin-brand">
        <UiIcon name="dish" :size="26" tone="white" /><span>校园安心餐</span>
      </div>
      <button v-for="item in navigation" :key="item.key" :class="{ active: view === item.key }"
        @click="navigate(item.key)">
        <UiIcon :name="item.icon" :size="22" tone="white" /><span>{{ item.label }}</span>
      </button>
    </aside>
    <main class="admin-main">
      <header class="admin-heading">
        <h1>{{ heading }}</h1><label v-if="view === 'daily'" class="date-control"><input v-model="date" type="date"
            aria-label="用餐日期" /></label><button v-if="view === 'monthly'" class="admin-button primary small"
          @click="exportMonthly">导出Excel</button><span v-if="!showcase" class="demo-label" :class="connectionState">{{ connectionLabel }}</span>
      </header>
      <template v-if="view === 'daily'">
        <div class="metric-grid">
          <div v-for="metric in metrics" :key="metric.label" class="metric-card" :class="metric.tone">
            <span>{{ metric.label }}</span>
            <div><strong>{{ metric.value }}</strong>
              <DesignAsset v-if="metric.art" :name="metric.art" :width="43" :height="53" />
              <UiIcon v-else name="pause" :size="47" tone="orange" />
            </div>
          </div>
        </div>
        <div class="table-heading">
          <h2>班级统计</h2>
          <div v-if="!showcase" class="admin-meal-filter"><button v-for="period in mealPeriods" :key="period.key"
              :class="{ active: mealPeriod === period.key }"
              @click="mealPeriod = period.key">{{ period.label }}</button></div>
        </div>
        <div class="table-scroll">
          <table class="data-table daily-table">
            <thead>
              <tr>
                <th>班级</th>
                <th>订餐人数</th>
                <th>停餐人数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dailyRows" :key="row.name">
                <td>{{ row.name.replace('级', '级 ') }}</td>
                <td>{{ row.ordered }}</td>
                <td>{{ row.stopped }}</td>
                <td><button class="table-link"
                    @click="detailClass = detailClass === row.name ? '' : row.name">{{ detailClass === row.name ? '收起详情' : '查看详情' }}</button>
                </td>
              </tr>
              <tr v-if="!dailyRows.length">
                <td colspan="4" class="table-empty">该日期暂无用餐记录</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="detailClass" class="detail-panel">
          <div class="detail-heading"><strong>{{ detailClass }} · {{ date }}</strong><button aria-label="关闭班级详情"
              @click="detailClass = ''">
              <UiIcon name="close" :size="20" />
            </button></div>
          <div class="detail-periods"><span>{{ periodName(mealPeriod) }}
              <b>{{ selectedClass.ordered }}</b> 人</span><span>已停餐
              <b>{{ selectedClass.stopped }}</b> 人</span></div>
          <table v-if="!showcase" class="data-table"><thead><tr><th>姓名</th><th>餐品</th><th>状态</th><th>停餐原因</th></tr></thead><tbody><tr v-for="order in detailOrders" :key="order.id"><td>{{ order.studentName }}</td><td>{{ order.mealName }}</td><td>{{ order.status === 'ordered' ? '已订餐' : '已停餐' }}</td><td>{{ order.reason || '—' }}</td></tr><tr v-if="!detailOrders.length"><td colspan="4">暂无记录</td></tr></tbody></table>
        </div>
        <div v-if="!showcase" class="table-scroll"><h2>教师订餐明细</h2><table class="data-table"><thead><tr><th>教师</th><th>餐品</th><th>金额</th><th>支付状态</th></tr></thead><tbody><tr v-for="order in dailyData.orders.filter(item => item.userType === 'teacher')" :key="order.id"><td>{{ order.studentName }}</td><td>{{ order.mealName }}</td><td>¥{{ order.price }}</td><td>{{ order.paymentStatus === 'TEST_PAID' ? '测试支付（未扣款）' : order.paymentStatus }}</td></tr></tbody></table></div>
        <div class="export-actions"><button class="admin-button primary" @click="exportDaily(false)">
            <UiIcon name="download" :size="22" tone="white" />导出当日统计
          </button><button class="admin-button" @click="exportDaily(true)">
            <UiIcon name="download" :size="22" />导出订餐明细
          </button></div>
      </template>
      <template v-else-if="view === 'monthly'">
        <div class="report-filters"><label>月份 <input v-model="month" type="month" aria-label="统计月份" /></label><label>班级
            <select v-model="classFilter" aria-label="筛选班级">
              <option value="">全部班级</option>
              <option v-for="row in classStats" :key="row.name">{{ row.name }}</option>
            </select></label><label v-if="!showcase">时段 <select v-model="mealPeriod" aria-label="统计时段">
              <option v-for="period in mealPeriods" :key="period.key" :value="period.key">{{ period.label }}</option>
            </select></label></div>
        <div class="monthly-reports">
          <div class="table-scroll">
            <table class="data-table monthly-table">
              <thead>
                <tr>
                  <th>班级</th>
                  <th>学生</th>
                  <th>订餐天数</th>
                  <th>停餐天数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in monthlyStudents" :key="student.className + '|' + (student.userId || student.name)">
                  <td>{{ student.className }}</td>
                  <td>{{ student.name }}</td>
                  <td>{{ student.ordered }}</td>
                  <td>{{ student.stopped }}</td>
                </tr>
                <tr v-if="!monthlyStudents.length">
                  <td colspan="4" class="table-empty">该月份暂无统计数据</td>
                </tr>
                <tr v-else-if="showcase" class="continuation">
                  <td>…</td>
                  <td>…</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <section class="chart-panel">
            <h3>班级订餐天数统计 <small>（总订餐天数）</small></h3>
            <div class="bar-chart" role="img" :aria-label="chartDescription">
              <div class="chart-axis"><span v-for="tick in chartTicks"
                  :key="tick">{{ tick.toLocaleString() }}</span></div>
              <div class="chart-plot">
                <div v-for="row in chartRows" :key="row.name" class="bar-column">
                  <div class="bar" :style="{ height: row.total / chartMax * 100 + '%' }"><span>{{ row.total }}</span></div><span
                    class="bar-label">{{ row.name }}</span>
                </div><span v-if="!chartRows.length" class="chart-empty">暂无数据</span>
              </div>
            </div>
          </section>
        </div>
      </template>
      <template v-else-if="view === 'finance'">
        <div class="notice-panel">
          <UiIcon name="info" :size="22" tone="green" />
          <p>{{ financeData.settlement }}；教师端当前使用测试支付，订单会同步但不会发生真实扣款。</p>
        </div>
        <div class="metric-grid finance-metrics">
          <div v-for="price in financeData.prices" :key="price.period" class="metric-card"><span>教师{{ price.label }}单价</span><strong>¥{{ Number(price.teacherPrice).toFixed(2) }}</strong></div>
        </div>
      </template>
      <template v-else-if="view === 'dishes' || view === 'menus'">
        <div class="report-filters"><label>用餐时段 <select v-model="mealPeriod">
              <option v-for="period in mealPeriods" :key="period.key" :value="period.key">{{ period.label }}</option>
            </select></label></div>
        <button v-if="!showcase" class="admin-button primary" @click="beginEditMenu({ date, day: '', period: mealPeriod, name: '', dishes: [], art: mealPeriod === 'snack' ? 'diet' : 'lunch', price: mealPeriod === 'snack' ? 6 : mealPeriod === 'dinner' ? 15 : 18 })">发布菜谱</button>
        <div class="admin-menu-list">
          <article v-for="item in visibleMenus" :key="item.date">
            <DesignAsset :name="item.art" :width="75" :height="75" />
            <div>
              <h3>{{ item.date }} {{ item.day }} · {{ item.name }}</h3>
              <p>{{ item.dishes.join(' · ') }}</p>
            </div>
            <button v-if="!showcase" class="table-link" @click="beginEditMenu(item)">修改</button>
          </article>
        </div>
        <form v-if="editingMenu" class="menu-editor" @submit.prevent="saveMenu">
          <div class="menu-editor-heading"><strong>修改 {{ editingMenu.day }}{{ periodName(editingMenu.period) }}</strong><button type="button" aria-label="关闭菜谱编辑" @click="editingMenu = null"><UiIcon name="close" :size="20" /></button></div>
          <label>日期<input v-model="editingMenu.date" type="date" :disabled="editingMenu.existing" required /></label>
          <label>价格<input v-model.number="editingMenu.price" type="number" min="0" step="0.01" required /></label>
          <label>餐品名称<input v-model.trim="editingMenu.name" maxlength="40" required /></label>
          <label>菜品内容<textarea v-model="editingMenu.dishesText" rows="3" maxlength="160" required /></label>
          <div class="menu-editor-actions"><button type="button" class="admin-button" @click="editingMenu = null">取消</button><button type="submit" class="admin-button primary" :disabled="savingMenu">{{ savingMenu ? '保存中…' : '保存菜谱' }}</button></div>
        </form>
      </template>
      <template v-else-if="view === 'classes'">
        <p>以下为今日各时段订餐人数与停餐餐次。</p>
        <table class="data-table">
          <thead>
            <tr>
              <th>班级</th>
              <th>午餐人数</th>
              <th>午点人数</th>
              <th>停餐人数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in classStats" :key="row.name">
              <td>{{ row.name }}</td>
              <td>{{ row.lunch }}</td>
              <td>{{ row.snack }}</td>
              <td>{{ row.stopped }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else-if="view === 'roles'">
        <p>角色资料展示；账号授权请在 RuoYi 系统管理中配置。</p>
        <table class="data-table">
          <thead>
            <tr>
              <th>角色</th>
              <th>权限范围</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(role, index) in roles" :key="role.name">
              <td><span class="role-tag" :class="{ orange: index % 2 }">{{ role.name }}</span></td>
              <td>{{ role.permissions.join('、') }} · {{ role.description }}</td>
              <td>已启用</td>
            </tr>
          </tbody>
        </table>
      </template>
      <div v-if="view === 'monthly'" class="admin-shortcuts">
        <div class="offline-note">
          <DesignAsset name="shop" :width="54" :height="71" />
          <div><strong>线下收费参考</strong>
            <p>系统仅统计次数，不自动计费</p>
          </div>
        </div><button class="shortcut role-shortcut" @click="navigate('roles')"><strong>角色管理</strong>
          <div><span class="role-tag">管理员</span><span class="role-tag orange">操作员</span></div>
        </button><button class="shortcut" @click="navigate('dishes')"><strong>菜品管理</strong>
          <p>管理菜品信息<br />与营养搭配</p>
          <DesignAsset name="bowl" :width="44" :height="45" />
        </button><button class="shortcut" @click="navigate('classes')"><strong>班级管理</strong>
          <p>维护班级信息<br />与人数</p>
          <DesignAsset name="people" :width="45" :height="48" />
        </button><button class="shortcut" @click="navigate('menus')"><strong>每周菜谱录入</strong>
          <p>制定每周菜谱<br />与营养计划</p>
          <DesignAsset name="checklist" :width="42" :height="46" />
        </button>
      </div>
      <div v-if="message" class="admin-message" role="status">{{ message }}</div>
    </main>
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DesignAsset from '../../canteen-mobile/components/DesignAsset.vue'
import UiIcon from '../../canteen-mobile/components/UiIcon.vue'
import { classStats as staticClassStats, mealPeriods, weekMenus as staticMenus } from '../../canteen-mobile/data/canteen.js'
import { canteenApi } from '../../canteen-mobile/data/canteen-api.js'

const props = defineProps({ initialView: { type: String, default: 'daily' }, showcase: Boolean })
const view = ref(props.initialView)
const today = new Date().toLocaleDateString('sv-SE')
const date = ref(props.showcase ? '2025-05-13' : today)
const month = ref(props.showcase ? '2025-05' : today.slice(0,7))
const classFilter = ref('')
const mealPeriod = ref('lunch')
const detailClass = ref('')
const message = ref('')
const connectionState = ref(props.showcase ? 'showcase' : 'loading')
const dailyData = ref({ rows: [], orders: [], metrics: {} })
const monthlyData = ref({ students: [], chartRows: [] })
const classRows = ref([])
const menus = ref(props.showcase ? staticMenus.map(row => ({ ...row, period: 'lunch', price: 18 })) : [])
const financeData = ref({ settlement: '学生餐费线下统一结算', prices: [
  { period: 'lunch', label: '午餐', teacherPrice: 18 },
  { period: 'snack', label: '午点', teacherPrice: 6 },
  { period: 'dinner', label: '晚餐', teacherPrice: 15 }
] })
const roles = ref([
  { name: '管理员', description: '系统设置、报表与全部业务管理', permissions: ['全部权限'] },
  { name: '操作员', description: '日常订餐、停餐及餐品维护', permissions: ['订餐管理', '餐品管理'] }
])
const editingMenu = ref(null)
const savingMenu = ref(false)
let syncTimer, refreshing = false
let messageTimer
let dailyRequest = 0
let monthlyRequest = 0

const navigation = [
  { key: 'daily', label: '数据总览', icon: 'grid' },
  { key: 'orders', label: '每日订餐', icon: 'orders' },
  { key: 'monthly', label: '月度统计', icon: 'chart' },
  { key: 'finance', label: '财务统计', icon: 'finance' },
  { key: 'dishes', label: '菜品管理', icon: 'dish' },
  { key: 'classes', label: '班级管理', icon: 'group' },
  { key: 'menus', label: '每周菜谱', icon: 'book' },
  { key: 'roles', label: '权限管理', icon: 'settings' }
]
const heading = computed(() => ({ daily: '每日用餐汇总', monthly: '月度用餐统计', finance: '财务统计', dishes: '菜品管理', classes: '班级管理', menus: '每周菜谱', roles: '角色与权限管理' }[view.value]))
const connectionLabel = computed(() => ({ loading: '正在同步', connected: '已同步 · 每 5 秒刷新', error: '连接失败', showcase: '设计预览' }[connectionState.value]))
const classStats = computed(() => props.showcase ? staticClassStats.map(row => ({ ...row, lunch: row.ordered, dinner: row.ordered })) : classRows.value)
const dailyRows = computed(() => props.showcase ? (date.value === '2025-05-13' ? classStats.value.map(row => ({ ...row, ordered: mealPeriod.value === 'snack' ? row.snack : row.lunch })) : []) : dailyData.value.rows)
const metrics = computed(() => {
  const values = props.showcase
    ? { studentOrders: dailyRows.value.length ? 628 : 0, stoppedStudents: dailyRows.value.length ? 37 : 0, teacherOrders: dailyRows.value.length ? 42 : 0, classes: dailyRows.value.length ? 18 : 0 }
    : dailyData.value.metrics || {}
  return [
    { label: '订餐学生', value: values.studentOrders || 0, art: 'student' },
    { label: '停餐学生', value: values.stoppedStudents || 0, tone: 'warning' },
    { label: '教师订餐', value: values.teacherOrders || 0, art: 'teacher' },
    { label: '用餐班级', value: values.classes || 0, art: 'group' }
  ]
})
const detailOrders = computed(() => dailyData.value.orders.filter(row => row.className === detailClass.value))
const chartMax = computed(() => props.showcase ? 1000 : Math.max(5, Math.ceil(Math.max(0, ...chartRows.value.map(row => row.total)) / 5) * 5))
const chartTicks = computed(() => [5,4,3,2,1,0].map(value => chartMax.value * value / 5))
const dailyReady = computed(() => props.showcase || (dailyData.value.date === date.value && dailyData.value.period === mealPeriod.value))
const monthlyReady = computed(() => props.showcase || (monthlyData.value.month === month.value && monthlyData.value.period === mealPeriod.value && monthlyData.value.className === (classFilter.value || '全部班级')))
const selectedClass = computed(() => dailyRows.value.find(row => row.name === detailClass.value) || dailyRows.value[0] || { ordered: 0, stopped: 0 })
const fallbackStudents = [
  { className: '一年级1班', name: '林小满', ordered: 18, stopped: 2 },
  { className: '一年级1班', name: '王一诺', ordered: 17, stopped: 3 },
  { className: '一年级1班', name: '张子轩', ordered: 19, stopped: 1 },
  { className: '二年级1班', name: '李思涵', ordered: 16, stopped: 4 },
  { className: '二年级1班', name: '陈星宇', ordered: 20, stopped: 0 },
  { className: '二年级1班', name: '周雨彤', ordered: 18, stopped: 2 }
]
const monthlyStudents = computed(() => props.showcase
  ? (month.value === '2025-05' ? fallbackStudents.filter(row => !classFilter.value || row.className === classFilter.value) : [])
  : monthlyData.value.students)
const chartRows = computed(() => props.showcase
  ? (month.value === '2025-05' ? staticClassStats.filter(row => !classFilter.value || row.name === classFilter.value).map(row => ({ ...row, total: mealPeriod.value === 'snack' ? Math.round(row.total * .9) : row.total })) : [])
  : monthlyData.value.chartRows.map(row => ({ ...row, total: row.value })))
const chartDescription = computed(() => chartRows.value.map(row => `${row.name} ${row.total}天`).join('，') || '该月份暂无数据')
const visibleMenus = computed(() => {
  const values = menus.value.filter(item => item.period === mealPeriod.value || (!item.period && mealPeriod.value === 'lunch'))
  return values.length ? values : (props.showcase ? staticMenus : [])
})

function navigate(key) {
  view.value = key === 'orders' ? 'daily' : key
  detailClass.value = ''
  message.value = ''
  refreshActiveView()
}
function periodName(key) { return mealPeriods.find(item => item.key === key)?.label || key }
function notify(text) {
  clearTimeout(messageTimer)
  message.value = text
  messageTimer = setTimeout(() => { message.value = '' }, 3000)
}
function markConnected() { connectionState.value = 'connected' }
function markError(error) {
  connectionState.value = 'error'
  notify(error?.message || '后台服务连接失败')
}
async function loadDaily() {
  if (props.showcase) return
  if (!date.value) { dailyRequest++; dailyData.value = { rows: [], orders: [], metrics: {} }; return }
  const requestId = ++dailyRequest
  if (!dailyReady.value) dailyData.value = { rows: [], orders: [], metrics: {} }
  connectionState.value = 'loading'
  try {
    const value = await canteenApi.daily(date.value, mealPeriod.value)
    if (requestId === dailyRequest) dailyData.value = value
    if (requestId === dailyRequest) markConnected()
  } catch (error) { if (requestId === dailyRequest) { dailyData.value = { rows: [], orders: [], metrics: {} }; markError(error) } }
}
async function loadMonthly() {
  if (props.showcase) return
  if (!month.value) { monthlyRequest++; monthlyData.value = { students: [], chartRows: [] }; return }
  const requestId = ++monthlyRequest
  if (!monthlyReady.value) monthlyData.value = { students: [], chartRows: [] }
  try {
    const value = await canteenApi.monthly(month.value, classFilter.value, mealPeriod.value)
    if (requestId === monthlyRequest) monthlyData.value = value
    if (requestId === monthlyRequest) markConnected()
  } catch (error) { if (requestId === monthlyRequest) { monthlyData.value = { students: [], chartRows: [] }; markError(error) } }
}
async function loadReferenceData() {
  if (props.showcase) return
  try {
    const [classValues, menuValues, financeValues, roleValues] = await Promise.all([
      canteenApi.classes(), canteenApi.menus(), canteenApi.finance(), canteenApi.roles()
    ])
    classRows.value = classValues
    menus.value = menuValues
    financeData.value = financeValues
    roles.value = roleValues
    markConnected()
  } catch (error) { markError(error) }
}
function beginEditMenu(item) {
  editingMenu.value = { ...item, existing: menus.value.some(menu => menu.date === item.date && menu.period === item.period), dishesText: item.dishes.join('、') }
}
async function saveMenu() {
  if (savingMenu.value) return
  if (!editingMenu.value?.name || !editingMenu.value?.dishesText) return notify('请填写餐品名称和菜品内容')
  const draft = { ...editingMenu.value }
  const dishes = draft.dishesText.split(/[、,，]/).map(value => value.trim()).filter(Boolean)
  if (!dishes.length) return notify('请至少填写一道菜品')
  savingMenu.value = true
  try {
    const updated = await canteenApi.updateMenu(draft.date, draft.period, {
      ...draft,
      name: draft.name.trim(),
      dishes
    })
    menus.value = [...menus.value.filter(value => !(value.date === updated.date && value.period === updated.period)), updated]
    editingMenu.value = null
    markConnected()
    notify('菜谱已保存，用户端将在 5 秒内同步')
  } catch (error) { markError(error) }
  finally { savingMenu.value = false }
}
function exportCsv(filename, rows) {
  const escape = value => '"' + String(value ?? '').replace(/^[=+@\-\t\r]/, match => "'" + match).replaceAll('"', '""') + '"'
  const blob = new Blob(['\uFEFF' + rows.map(row => row.map(escape).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename + '.csv'
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
  notify('报表已导出，可使用 Excel 打开')
}
function exportDaily(details) {
  if (!dailyReady.value) return notify('当前筛选数据尚未同步，请等待或重试')
  if (details && !dailyData.value.orders.length) return notify('该日期暂无订餐明细')
  if (!dailyRows.value.length) return notify('该日期暂无可导出的记录')
  const rows = details
    ? [['订单号', '日期', '班级', '姓名', '身份', '用餐时段', '餐品', '金额', '状态', '停餐原因', '支付状态'], ...dailyData.value.orders.map(row => [row.id, row.date, row.className, row.studentName, row.userType === 'teacher' ? '教师' : '学生', periodName(row.period), row.mealName, row.price, row.status === 'ordered' ? '已订餐' : '已停餐', row.reason, row.paymentStatus])]
    : [['日期', '班级', '用餐时段', '订餐人数', '停餐人数'], ...dailyRows.value.map(row => [date.value, row.name, periodName(mealPeriod.value), row.ordered, row.stopped])]
  exportCsv(`${date.value}-${details ? '订餐明细' : '用餐统计'}`, rows)
}
function exportMonthly() {
  if (!monthlyReady.value) return notify('当前筛选数据尚未同步，请等待或重试')
  if (!monthlyStudents.value.length) return notify('当前筛选暂无可导出的记录')
  exportCsv(`${month.value}-月度用餐统计`, [['月份', '班级', '学生', '时段', '订餐天数', '停餐天数'], ...monthlyStudents.value.map(row => [month.value, row.className, row.name, periodName(mealPeriod.value), row.ordered, row.stopped])])
}

watch([date, mealPeriod], () => { detailClass.value = ''; loadDaily() })
watch([month, classFilter, mealPeriod], loadMonthly)
watch(mealPeriod, () => { editingMenu.value = null })
async function refreshActiveView() {
  if (props.showcase || refreshing) return
  refreshing = true
  try {
    if (view.value === 'daily') await loadDaily()
    else if (view.value === 'monthly') await loadMonthly()
    else await loadReferenceData()
  } finally { refreshing = false }
}
onMounted(() => { if (!props.showcase) { Promise.all([loadDaily(), loadMonthly(), loadReferenceData()]); syncTimer = setInterval(refreshActiveView, 5000) } })
onBeforeUnmount(() => { clearTimeout(messageTimer); clearInterval(syncTimer); dailyRequest++; monthlyRequest++ })
</script>
<style src="./canteen-admin.css"></style>
