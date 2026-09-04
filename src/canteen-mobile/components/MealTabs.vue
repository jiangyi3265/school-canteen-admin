<template>
  <view class="meal-tabs" :class="{ compact }" role="tablist" aria-label="用餐时段"><button v-for="item in mealPeriods"
      :key="item.key" class="meal-tab" :class="{ selected: modelValue === item.key }" role="tab" :aria-selected="modelValue === item.key"
      @click="$emit('update:modelValue', item.key)">{{ item.label }}</button></view>
</template>
<script setup>
import { mealPeriods } from '../data/canteen.js'
defineProps({ modelValue: String, compact: Boolean })
defineEmits(['update:modelValue'])
</script>
<style scoped>
/* Keep the layout inside this component: parent WXSS is isolated in WeChat. */
.meal-tabs {
  box-sizing: border-box;
  display: flex;
  gap: 6px;
  margin: 0 0 15px;
}
.meal-tab {
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 43px;
  border: 0;
  border-radius: 24px;
  background: #eff1f1;
  color: #8b8d93;
  font-family: inherit;
  font-size: 17px;
  line-height: 1.5;
  cursor: pointer;
}
.meal-tab::after { border: 0; }
.meal-tab.selected { background: linear-gradient(110deg, #09985b, #07834f); color: #fff; }
.meal-tab:active { opacity: .78; }
.meal-tab:focus-visible { outline: 3px solid #ffb837; outline-offset: 2px; }
.meal-tabs.compact { width: 207px; max-width: 100%; margin: 0; }
.compact .meal-tab { height: 34px; border-radius: 6px; font-size: 15px; }
@media (max-width: 360px) {
  .meal-tabs.compact { width: 180px; }
}
</style>
