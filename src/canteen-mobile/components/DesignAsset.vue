<template>
  <view class="design-asset" :style="{ width: width + 'px', height: height + 'px' }" :aria-label="label" role="img">
    <image class="design-asset-image" :src="source" mode="scaleToFill" :alt="label" :style="imageStyle" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ name: String, width: { type: Number, default: 48 }, height: { type: Number, default: 48 }, label: { type: String, default: '' }, source: { type: String, default: '/static/canteen/design-assets.png' } })
// Original artwork is displayed as a sprite. Text and controls are real components.
const regions = {
  avatar: [55, 112, 39, 47], leaves: [199, 126, 35, 35],
  lunch: [297, 200, 103, 96], beef: [45, 604, 99, 81],
  monday: [49, 211, 36, 36], tuesday: [86, 211, 36, 36], wednesday: [123, 211, 36, 36], thursday: [161, 211, 35, 36], friday: [199, 211, 34, 36],
  personal: [791, 162, 33, 48], sick: [881, 162, 31, 48], outing: [792, 235, 31, 44], school: [876, 235, 39, 44], transfer: [790, 309, 34, 44], holiday: [882, 313, 32, 38], diet: [791, 382, 33, 39], other: [886, 391, 26, 26],
  student: [1117, 128, 24, 31], teacher: [1338, 127, 25, 32], group: [1457, 131, 28, 27],
  shop: [966, 793, 32, 44], bowl: [1282, 823, 28, 30], people: [1370, 818, 30, 31], checklist: [1463, 821, 28, 32]
}
const imageStyle = computed(() => {
  const [x, y, w, h] = regions[props.name] || regions.lunch
  return { width: 1536 / w * 100 + '%', height: 1024 / h * 100 + '%', left: -x / w * 100 + '%', top: -y / h * 100 + '%' }
})
</script>

<style scoped>
.design-asset { display: inline-block; position: relative; overflow: hidden; flex-shrink: 0; vertical-align: middle; }
.design-asset-image { position: absolute; display: block; max-width: none; pointer-events: none; }
</style>
