import { createApp } from 'vue'
import Preview from './Preview.vue'
import DatePicker from './DatePicker.vue'
const app = createApp(Preview)
app.component('picker', DatePicker)
app.mount('#app')
