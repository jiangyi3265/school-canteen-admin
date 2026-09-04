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
          @click="exportMonthly">导出Excel</button><span v-if="!showcase" class="demo-label">示例数据</span>
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
                <td>{{ mealPeriod === 'snack' ? row.snack : row.ordered }}</td>
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
          <div class="detail-periods"><span v-for="period in mealPeriods" :key="period.key">{{ period.label }}
              <b>{{ period.key === 'snack' ? selectedClass.snack : selectedClass.ordered }}</b> 人</span><span>已停餐
              <b>{{ selectedClass.stopped }}</b> 人</span></div>
        </div>
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
                <tr v-for="student in monthlyStudents" :key="student.name">
                  <td>{{ student.className }}</td>
                  <td>{{ student.name }}</td>
                  <td>{{ student.ordered }}</td>
                  <td>{{ student.stopped }}</td>
                </tr>
                <tr v-if="!monthlyStudents.length">
                  <td colspan="4" class="table-empty">该月份暂无统计数据</td>
                </tr>
                <tr v-else class="continuation">
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
              <div class="chart-axis"><span v-for="tick in [1000,800,600,400,200,0]"
                  :key="tick">{{ tick.toLocaleString() }}</span></div>
              <div class="chart-plot">
                <div v-for="row in chartRows" :key="row.name" class="bar-column">
                  <div class="bar" :style="{ height: row.total / 10 + '%' }"><span>{{ row.total }}</span></div><span
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
          <p>学生餐费在线下收取，教师餐费通过微信支付。当前为设计示例，尚未连接收款服务。</p>
        </div>
        <div class="metric-grid finance-metrics">
          <div class="metric-card"><span>学生午餐单价</span><strong>¥18.00</strong></div>
          <div class="metric-card"><span>营养午点单价</span><strong>¥6.00</strong></div>
          <div class="metric-card"><span>晚餐单价</span><strong>¥15.00</strong></div>
        </div>
      </template>
      <template v-else-if="view === 'dishes' || view === 'menus'">
        <div class="report-filters"><label>用餐时段 <select v-model="mealPeriod">
              <option v-for="period in mealPeriods" :key="period.key" :value="period.key">{{ period.label }}</option>
            </select></label></div>
        <div class="admin-menu-list">
          <article v-for="item in weekMenus" :key="item.date">
            <DesignAsset :name="mealPeriod === 'snack' ? 'diet' : item.art" :width="75" :height="75" />
            <div>
              <h3>{{ item.day }} · {{ mealPeriod === 'snack' ? '营养午点' : item.name }}</h3>
              <p>{{ mealPeriod === 'snack' ? '鲜牛奶 · 松软小面包 · 时令水果' : item.dishes.join(' · ') }}</p>
            </div>
          </article>
        </div>
      </template>
      <template v-else-if="view === 'classes'">
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
              <td>{{ row.ordered }}</td>
              <td>{{ row.snack }}</td>
              <td>{{ row.stopped }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else-if="view === 'roles'">
        <table class="data-table">
          <thead>
            <tr>
              <th>角色</th>
              <th>权限范围</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="role-tag">管理员</span></td>
              <td>数据统计、菜品、班级、菜谱和角色管理</td>
              <td>已启用</td>
            </tr>
            <tr>
              <td><span class="role-tag orange">操作员</span></td>
              <td>查看订餐、录入每周菜谱</td>
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
import { computed, onBeforeUnmount, ref } from 'vue'
import DesignAsset from '../../canteen-mobile/components/DesignAsset.vue'
import UiIcon from '../../canteen-mobile/components/UiIcon.vue'
import { classStats, mealPeriods, weekMenus } from '../../canteen-mobile/data/canteen.js'
const props = defineProps({ initialView: { type: String, default: 'daily' }, showcase: Boolean })
const view = ref(props.initialView), date = ref('2025-05-13'), month = ref('2025-05'), classFilter = ref(''), mealPeriod = ref('lunch'), detailClass = ref(''), message = ref('')
let messageTimer
const navigation = [{ key: 'daily', label: '数据总览', icon: 'grid' }, { key: 'orders', label: '每日订餐', icon: 'orders' }, { key: 'monthly', label: '月度统计', icon: 'chart' }, { key: 'finance', label: '财务统计', icon: 'finance' }, { key: 'dishes', label: '菜品管理', icon: 'dish' }, { key: 'classes', label: '班级管理', icon: 'group' }, { key: 'menus', label: '每周菜谱', icon: 'book' }, { key: 'roles', label: '权限管理', icon: 'settings' }]
const heading = computed(() => ({ daily: '每日用餐汇总', monthly: '月度用餐统计', finance: '财务统计', dishes: '菜品管理', classes: '班级管理', menus: '每周菜谱', roles: '角色与权限管理' }[view.value]))
const dailyRows = computed(() => date.value === '2025-05-13' ? classStats : [])
const metrics = computed(() => [{ label: '订餐学生', value: dailyRows.value.length ? 628 : 0, art: 'student' }, { label: '停餐学生', value: dailyRows.value.length ? 37 : 0, tone: 'warning' }, { label: '教师订餐', value: dailyRows.value.length ? 42 : 0, art: 'teacher' }, { label: '用餐班级', value: dailyRows.value.length ? 18 : 0, art: 'group' }])
const selectedClass = computed(() => classStats.find(row => row.name === detailClass.value) || classStats[0])
const studentRows = [{ className: '一年级1班', name: '林小满', ordered: 18, stopped: 2 }, { className: '一年级1班', name: '王一诺', ordered: 17, stopped: 3 }, { className: '一年级1班', name: '张子轩', ordered: 19, stopped: 1 }, { className: '二年级1班', name: '李思涵', ordered: 16, stopped: 4 }, { className: '二年级1班', name: '陈星宇', ordered: 20, stopped: 0 }, { className: '二年级1班', name: '周雨彤', ordered: 18, stopped: 2 }]
const monthlyStudents = computed(() => month.value !== '2025-05' ? [] : studentRows.filter(row => !classFilter.value || row.className === classFilter.value).map(row => ({ ...row, ordered: mealPeriod.value === 'snack' ? Math.max(0, row.ordered - 1) : row.ordered })))
const chartRows = computed(() => month.value !== '2025-05' ? [] : classStats.filter(row => !classFilter.value || row.name === classFilter.value).map(row => ({ ...row, total: mealPeriod.value === 'snack' ? Math.round(row.total * .9) : row.total })))
const chartDescription = computed(() => chartRows.value.map(row => `${row.name} ${row.total}天`).join('，') || '该月份暂无数据')
function navigate(key) { view.value = key === 'orders' ? 'daily' : key; detailClass.value = ''; message.value = '' }
function notify(text) { clearTimeout(messageTimer); message.value = text; messageTimer = setTimeout(() => { message.value = '' }, 3000) }
function exportCsv(filename, rows) {
  const escape = value => '"' + String(value ?? '').replaceAll('"', '""') + '"'
  const blob = new Blob(['\uFEFF' + rows.map(row => row.map(escape).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob), anchor = document.createElement('a'); anchor.href = url; anchor.download = filename + '.csv'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1500); notify('报表已导出，可使用 Excel 打开')
}
function exportDaily(details) { if (!dailyRows.value.length) return notify('该日期暂无可导出的记录'); const rows = details ? [['日期','班级','用餐时段','订餐人数','停餐人数'], ...dailyRows.value.flatMap(row => mealPeriods.map(period => [date.value,row.name,period.label,period.key === 'snack' ? row.snack : row.ordered,row.stopped]))] : [['日期','班级','午餐人数','午点人数','晚餐人数','停餐人数'], ...dailyRows.value.map(row => [date.value,row.name,row.ordered,row.snack,row.ordered,row.stopped])]; exportCsv(`${date.value}-${details ? '订餐明细' : '用餐统计'}`, rows) }
function exportMonthly() { if (!monthlyStudents.value.length) return notify('当前筛选暂无可导出的记录'); exportCsv(`${month.value}-月度用餐统计`, [['月份','班级','学生','时段','订餐天数','停餐天数'], ...monthlyStudents.value.map(row => [month.value,row.className,row.name,mealPeriods.find(item => item.key === mealPeriod.value).label,row.ordered,row.stopped])]) }
onBeforeUnmount(() => clearTimeout(messageTimer))
</script>
<style src="./canteen-admin.css"></style>
