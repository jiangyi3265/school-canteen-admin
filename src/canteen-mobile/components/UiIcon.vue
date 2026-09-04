<template>
  <image class="ui-icon" :class="tone" :src="base + '/' + name + '.svg'"
    :style="{ width: size + 'px', height: size + 'px' }" mode="aspectFit" alt="" aria-hidden="true" />
</template>
<script setup>
defineProps({ name: { type: String, default: 'calendar' }, size: { type: Number, default: 22 }, tone: { type: String, default: '' }, base: { type: String, default: '/static/canteen/icons' } })
</script>
<style scoped>
.ui-icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
.ui-icon.green { filter: invert(38%) sepia(63%) saturate(816%) hue-rotate(113deg) brightness(91%) contrast(96%); }
.ui-icon.white { filter: brightness(0) invert(1); }
.ui-icon.orange { filter: invert(64%) sepia(89%) saturate(1946%) hue-rotate(356deg) brightness(103%); }
</style>
