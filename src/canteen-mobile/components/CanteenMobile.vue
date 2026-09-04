<template>
  <view class="mobile-app" :class="['screen-' + page, { 'is-showcase': showcase, 'native-client': statusTop > 0 }]" :style="{ '--status-top': statusTop + 'px' }">
    <view v-if="showcase" class="phone-status"><text>9:41</text>
      <view class="status-signals"><text>▴▴▴</text><text>◒</text>
        <view class="battery" />
      </view>
    </view>
    <view class="mobile-header">
      <button v-if="page !== 'home'" class="icon-button back-button" aria-label="返回首页" @click="go('home')">
        <UiIcon name="back" :size="22" />
      </button>
      <text :class="{ 'brand-title': page === 'home' }">{{ titles[page] }}</text>
      <view v-if="showcase || statusTop === 0" class="wechat-capsule" aria-hidden="true">
        <UiIcon name="more" :size="23" />
        <view class="capsule-divider" />
        <view class="capsule-circle" />
      </view>
    </view>
    <view class="mobile-content">
      <template v-if="page === 'home'">
        <view class="student-card mobile-card">
          <DesignAsset name="avatar" :width="73" :height="85" label="学生头像" />
          <view class="student-copy"><text class="student-name">林小满 · 三年级2班</text><text
              class="muted student-greeting">健康饮食 · 快乐成长</text></view>
          <DesignAsset class="profile-leaf" name="leaves" :width="59" :height="59" />
        </view>
        <WeeklyMenu @select="showWeekly" />
        <view class="quick-actions"><button v-for="action in quickActions" :key="action.page"
            class="quick-action mobile-card" @click="go(action.page)">
            <view class="action-icon" :class="{ amber: action.page === 'stop' }">
              <UiIcon :name="action.icon" :size="30" tone="white" />
            </view><text>{{ action.label }}</text>
          </button></view>
      </template>
      <template v-else-if="page === 'order'">
        <view class="day-selector mobile-card"><button v-for="(day, i) in weekMenus" :key="day.date" class="day-button"
            :class="{ selected: date === day.date }"
            @click="date = day.date"><text>{{ i === 0 ? '今天' : i === 1 ? '明天' : day.day }}</text><text>{{ Number(day.date.slice(5,7)) + '.' + Number(day.date.slice(8)) }}</text></button>
        </view>
        <MealTabs v-model="period" />
        <view class="meal-card mobile-card">
          <view class="meal-main">
            <view class="meal-photo" :class="{ 'snack-photo': period === 'snack' }">
              <DesignAsset :name="meal.art" :width="period === 'snack' ? 120 : 185"
                :height="period === 'snack' ? 142 : 173" :label="meal.name" />
            </view>
            <view class="meal-description"><text class="meal-name">{{ meal.name }}</text><text
                v-for="dish in meal.dishes" :key="dish" class="dish-line">{{ dish }}</text></view>
          </view><text class="meal-note muted">{{ meal.description }}</text>
        </view>
        <view class="notice warning">
          <UiIcon name="info" :size="23" tone="orange" /><text>费用线下收取</text>
        </view>
        <button class="primary-button" @click="confirmOrder">确认订餐</button>
        <view v-if="orderFeedback" class="inline-feedback">
          <UiIcon name="check" :size="20" tone="green" /><text>{{ orderFeedback }}</text><button
            @click="go('records')">查看记录</button>
        </view>
      </template>
      <template v-else-if="page === 'stop'">
        <view class="stop-form mobile-card">
          <view class="form-row"><text>停餐日期</text>
            <picker mode="date" :value="date" @change="changeDate">
              <view class="date-value">{{ date }}
                <UiIcon name="next" :size="18" />
              </view>
            </picker>
          </view>
          <view class="form-row"><text>用餐时段</text>
            <MealTabs v-model="period" compact />
          </view><text class="field-label">停餐类型</text>
          <view class="reason-grid"><button v-for="reason in stopReasons" :key="reason.key" class="reason-button"
              :class="{ selected: reasonKey === reason.key }" @click="reasonKey = reason.key">
              <DesignAsset :name="reason.key" :width="42" :height="55" />
              <view><text class="reason-title">{{ reason.title }}</text><text
                  class="reason-description">{{ reason.description }}</text></view>
              <UiIcon v-if="reasonKey === reason.key" class="selected-check" name="check" :size="17" tone="green" />
            </button></view>
          <textarea v-if="reasonKey === 'other'" v-model="reasonNote" class="reason-note" placeholder="请填写停餐原因"
            maxlength="120" aria-label="停餐原因" /><button class="primary-button stop-submit"
            @click="submitStop">提交申请</button>
        </view>
      </template>
      <template v-else-if="page === 'rules'">
        <view class="notice rule-notice">
          <UiIcon name="info" :size="20" tone="green" /><text>规则仅供参考，费用结算在线下完成</text>
        </view>
        <view class="rule-grid"><button v-for="reason in stopReasons" :key="reason.key" class="rule-card mobile-card"
            @click="openRule(reason)"><text class="reason-title">{{ reason.title }}</text>
            <view class="rule-description"><text class="rule-summary">{{ reason.description }}</text>
              <DesignAsset :name="reason.key" :width="57" :height="75" />
            </view>
          </button></view>
        <view v-if="activeRule" class="rule-detail mobile-card"><text
            class="reason-title">{{ activeRule.title }}</text><text
            class="rule-detail-copy">{{ activeRule.description }}请选择停餐日期和用餐时段后提交申请。</text><button class="text-button"
            @click="applyRule">去申请停餐
            <UiIcon name="next" :size="16" tone="green" />
          </button></view>
      </template>
      <template v-else-if="page === 'teacher'">
        <view class="mobile-card teacher-form">
          <view class="form-row"><text>日期</text>
            <picker mode="date" :value="date" @change="changeDate">
              <view class="date-value">{{ date }}
                <UiIcon name="calendar" :size="19" />
              </view>
            </picker>
          </view>
          <view class="form-row"><text>用餐时段</text>
            <MealTabs v-model="period" compact />
          </view>
        </view>
        <view class="mobile-card teacher-meal">
          <view class="meal-main">
            <view class="meal-photo" :class="{ 'snack-photo': period === 'snack' }">
              <DesignAsset :name="meal.art" :width="period === 'snack' ? 105 : 171"
                :height="period === 'snack' ? 118 : 147" :label="meal.name" />
            </view>
            <view class="meal-description"><text class="meal-name">{{ meal.name }}</text><text
                v-for="dish in meal.dishes" :key="dish" class="dish-line">{{ dish }}</text></view>
          </view><text class="meal-price">¥{{ meal.price.toFixed(2) }}</text><button
            class="primary-button payment-button" @click="pay">
            <UiIcon name="wechat" :size="25" tone="white" />微信支付
          </button><text v-if="paymentNotice" class="payment-notice">{{ paymentNotice }}</text>
        </view>
        <view v-if="showcase" class="payment-success mobile-card">
          <view class="success-seal">
            <UiIcon name="success" :size="38" tone="white" />
          </view><text class="success-title">支付成功</text><text class="muted">感谢您的订餐！</text>
        </view>
      </template>
      <template v-else-if="page === 'records'">
        <view class="record-tabs" role="tablist"><button v-for="tab in recordTabs" :key="tab.key" role="tab"
            :aria-selected="recordTab === tab.key" :class="{ selected: recordTab === tab.key }"
            @click="recordTab = tab.key">{{ tab.label }}</button></view>
        <view class="records-list mobile-card">
          <view v-for="record in filteredOrders" :key="record.id" class="record-row">
            <view class="record-copy">
              <text>{{ record.date }}（{{ weekday(record.date) }}）{{ periodName(record.period) }}</text><text>{{ record.name }}</text>
            </view><text class="status-tag"
              :class="record.status">{{ record.status === 'ordered' ? '已订餐' : '已停餐' }}</text>
          </view>
          <view v-if="!filteredOrders.length" class="empty-state">
            <UiIcon name="record" :size="35" /><text>还没有{{ recordTab === 'stopped' ? '停餐' : '订餐' }}记录</text><button
              class="text-button" @click="go('order')">去选择餐食</button>
          </view>
        </view>
        <WeeklyMenu title="本周菜谱" compact @select="showWeekly" />
      </template>
      <template v-else-if="page === 'weekly'">
        <view class="notice rule-notice">
          <UiIcon name="book" :size="20" tone="green" /><text>本周营养食谱 · 5.12–5.18</text>
        </view>
        <MealTabs v-model="period" />
        <view v-for="item in weekMenus" :key="item.date" class="weekly-detail mobile-card">
          <DesignAsset :name="period === 'snack' ? 'diet' : item.art" :width="86" :height="86" />
          <view><text class="meal-name">{{ item.day }} ·
              {{ periodName(period) }}</text><text>{{ period === 'snack' ? '鲜牛奶 · 小面包 · 时令水果' : item.dishes.join(' · ') }}</text>
          </view>
        </view>
      </template>
      <template v-else-if="page === 'profile'">
        <view class="student-card mobile-card">
          <DesignAsset name="avatar" :width="73" :height="85" />
          <view class="student-copy"><text class="student-name">林小满 · 三年级2班</text><text
              class="muted student-greeting">校园安心餐</text></view>
        </view>
        <button v-for="action in profileActions" :key="action.page" class="profile-action mobile-card"
          @click="go(action.page)">
          <UiIcon :name="action.icon" :size="26" tone="green" /><text
            class="profile-action-label">{{ action.label }}</text>
          <UiIcon name="next" :size="19" />
        </button>
      </template>
    </view>
    <view v-if="['home', 'order', 'records', 'profile', 'weekly'].includes(page)" class="mobile-tabbar"><button
        v-for="tab in navTabs" :key="tab.page"
        :class="{ active: page === tab.page || page === 'weekly' && tab.page === 'home' }" @click="go(tab.page)">
        <UiIcon :name="tab.icon" :size="26" :tone="page === tab.page ? 'green' : ''" /><text>{{ tab.label }}</text>
      </button></view>
    <view v-if="toast" class="mobile-toast" role="status">{{ toast }}</view>
  </view>
</template>
<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import DesignAsset from './DesignAsset.vue'
import UiIcon from './UiIcon.vue'
import MealTabs from './MealTabs.vue'
import WeeklyMenu from './WeeklyMenu.vue'
import { initialOrders, mealPeriods, menuFor, readOrders, saveOrders, stopReasons, upsertOrder, weekMenus } from '../data/canteen.js'
const props = defineProps({ initialPage: { type: String, default: 'home' }, showcase: Boolean })
const statusTop = !props.showcase && typeof uni !== 'undefined' ? (uni.getWindowInfo?.().statusBarHeight || 0) : 0
const page = ref(props.initialPage), date = ref('2025-05-13'), period = ref('lunch'), reasonKey = ref(''), reasonNote = ref(''), activeRule = ref(null), recordTab = ref('all')
const orders = ref(props.showcase ? initialOrders.map(item => ({ ...item })) : readOrders())
const orderFeedback = ref(''), paymentNotice = ref(''), toast = ref('')
let toastTimer
const titles = { home: '校园安心餐', order: '选择订餐', stop: '停餐申请', rules: '停餐规则', teacher: '教师订餐', records: '订餐记录', weekly: '每周菜谱', profile: '我的' }
const quickActions = [{ page: 'order', label: '明日订餐', icon: 'calendar' }, { page: 'stop', label: '申请停餐', icon: 'pause' }, { page: 'weekly', label: '每周菜谱', icon: 'book' }, { page: 'rules', label: '停餐规则', icon: 'shield' }]
const navTabs = [{ page: 'home', label: '首页', icon: 'home' }, { page: 'order', label: '订餐', icon: 'calendar' }, { page: 'records', label: '记录', icon: 'record' }, { page: 'profile', label: '我的', icon: 'user' }]
const profileActions = [{ page: 'teacher', label: '教师订餐', icon: 'user' }, { page: 'records', label: '订餐记录', icon: 'record' }, { page: 'rules', label: '停餐规则', icon: 'shield' }]
const recordTabs = [{ key: 'all', label: '全部' }, { key: 'ordered', label: '已订餐' }, { key: 'stopped', label: '已停餐' }]
const meal = computed(() => menuFor(date.value, period.value, page.value === 'teacher'))
const filteredOrders = computed(() => orders.value.filter(item => recordTab.value === 'all' || item.status === recordTab.value))
watch(() => props.initialPage, value => { page.value = value })
watch([date, period], () => { orderFeedback.value = ''; paymentNotice.value = '' })
onBeforeUnmount(() => clearTimeout(toastTimer))
function go(target) { page.value = target; activeRule.value = null; toast.value = ''; if (target === 'records' && !props.showcase) orders.value = readOrders() }
function notify(message) { clearTimeout(toastTimer); toast.value = message; toastTimer = setTimeout(() => { toast.value = '' }, 2800) }
function changeDate(event) { date.value = event.detail.value }
function periodName(key) { return mealPeriods.find(item => item.key === key)?.label || key }
function weekday(value) { return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(value + 'T12:00:00').getDay()] }
function showWeekly(value) { date.value = value; go('weekly') }
function commit(record) { orders.value = upsertOrder(orders.value, record); if (!props.showcase && !saveOrders(orders.value)) notify('当前浏览器无法保存，请勿关闭页面') }
function confirmOrder() { if (!date.value) return notify('请选择订餐日期'); commit({ date: date.value, period: period.value, name: meal.value.name, status: 'ordered' }); orderFeedback.value = `${date.value.slice(5)} ${periodName(period.value)}已订餐`; notify('订餐成功，可在记录中查看') }
function submitStop() { if (!reasonKey.value) return notify('请选择停餐类型'); if (reasonKey.value === 'other' && !reasonNote.value.trim()) return notify('请填写停餐原因'); commit({ date: date.value, period: period.value, name: meal.value.name, status: 'stopped', reason: reasonKey.value, note: reasonNote.value.trim() }); page.value = 'records'; recordTab.value = 'stopped'; notify(`${periodName(period.value)}停餐申请已保存`) }
function openRule(reason) { activeRule.value = activeRule.value?.key === reason.key ? null : reason }
function applyRule() { reasonKey.value = activeRule.value.key; page.value = 'stop'; activeRule.value = null }
function pay() { paymentNotice.value = '微信支付尚未接入，当前未扣款。'; notify(paymentNotice.value) }
</script>
<style src="./canteen-mobile.css"></style>
