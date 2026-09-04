<template>
  <view class="weekly-menu" :class="{ compact }">
    <view class="section-heading"><text>{{ title }}</text><text class="week-range">5.12–5.18</text></view>
    <view class="week-grid"><button v-for="item in weekMenus" :key="item.date" class="week-day"
        :aria-label="item.day + '菜单'" @click="$emit('select', item.date)"><text class="week-label">{{ item.day }}</text>
        <DesignAsset :name="item.art" :width="60" :height="60" :label="item.name" />
        <view class="mini-dishes"><text class="mini-dish" v-for="dish in item.dishes.slice(0,3)"
            :key="dish">{{ dish }}</text></view>
      </button></view>
  </view>
</template>
<script setup>
import { weekMenus } from '../data/canteen.js'
import DesignAsset from './DesignAsset.vue'
defineProps({ title: { type: String, default: '本周菜单预览' }, compact: Boolean })
defineEmits(['select'])
</script>
<style scoped>
/* These rules must travel with WeeklyMenu rather than its isolated parent. */
.weekly-menu {
  box-sizing: border-box;
  width: 100%;
  padding: 13px 8px 15px;
  margin-bottom: 14px;
  background: #fff;
  border: 1px solid #e6ebea;
  border-radius: 13px;
  box-shadow: 0 2px 9px #163e2810;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 9px;
  margin-bottom: 12px;
  color: #252a2d;
  font-size: 18px;
  font-weight: 600;
}
.week-range { color: #7d8188; font-size: 14px; font-weight: 400; }
.week-grid { display: flex; gap: 2px; }
.week-day {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-family: inherit;
  line-height: 1.5;
  cursor: pointer;
}
.week-day::after { border: 0; }
.week-day:active { opacity: .78; }
.week-day:focus-visible { outline: 3px solid #ffb837; outline-offset: 2px; }
.week-label { margin-bottom: 10px; color: #535b61; font-size: 14px; }
.mini-dishes { margin-top: 7px; color: #646a70; font-size: 12px; line-height: 1.55; }
.mini-dish { display: block; white-space: nowrap; }
.weekly-menu.compact { margin-bottom: 0; padding-bottom: 8px; }
.compact .section-heading { color: #25674c; }
@media (max-width: 360px) {
  .weekly-menu { padding-right: 4px; padding-left: 4px; }
  .mini-dishes { font-size: 10px; }
}
</style>
