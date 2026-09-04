<template><label class="preview-date-picker"><slot /><input type="date" :value="value" aria-label="选择日期" @change="$emit('change', { detail: { value: $event.target.value } })" /></label></template>
<script setup>
defineProps({ value: String, mode: String })
defineEmits(['change'])
</script>
<style>.preview-date-picker{display:block;position:relative;cursor:pointer}.preview-date-picker>input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}</style>
