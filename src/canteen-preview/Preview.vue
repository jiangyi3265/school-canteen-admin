<template>
  <div v-if="mode === 'board'" class="design-preview">
    <div class="board-scroll">
      <div class="design-board" :key="revision" :style="{ zoom: boardZoom }">
        <section v-for="(screen, index) in screens" :key="screen.key" class="phone-example"
          :class="'phone-' + (index + 1)">
          <h2><span class="screen-number">{{ index + 1 }}</span><a
              :href="'?view=mobile&page=' + screen.key">{{ screen.title }}</a></h2>
          <div class="phone-frame" :class="{ short: index > 3 }">
            <div class="phone-render">
              <CanteenMobile :initial-page="screen.key" showcase />
            </div>
          </div>
        </section>
        <section class="admin-example daily-example">
          <h2><a href="?view=admin">后台管理 1 <span>｜ 每日运维看板</span></a></h2>
          <div class="admin-frame">
            <div class="admin-render">
              <CanteenAdmin showcase />
            </div>
          </div>
        </section>
        <section class="admin-example monthly-example">
          <h2><a href="?view=admin&page=monthly">后台管理 2 <span>｜ 月度报表与设置</span></a></h2>
          <div class="admin-frame">
            <div class="admin-render">
              <CanteenAdmin initial-view="monthly" showcase />
            </div>
          </div>
        </section>
        <footer class="design-system">
          <section class="palette-section">
            <h3>色彩规范</h3>
            <div class="color-palette">
              <div v-for="color in colors" :key="color.hex">
                <div class="color-swatch" :style="{ background: color.hex }"></div>
                <span>{{ color.name }}</span><small>{{ color.hex }}</small>
              </div>
            </div>
          </section>
          <section class="buttons-section">
            <h3>按钮样式</h3>
            <div class="button-specimens"><button class="sample-primary" @click="revision++">主要按钮</button><button
                class="sample-secondary" @click="mode = 'mobile'">次要按钮</button><button class="sample-text"
                @click="mode = 'admin'">文字按钮</button><button disabled>禁用按钮</button></div>
          </section>
          <section class="tags-section">
            <h3>状态标签</h3>
            <div class="tag-specimens"><span class="ordered">已订餐</span><span class="stopped">已停餐</span><span
                class="information">信息</span><span class="cancelled">已取消</span></div>
          </section>
          <section class="icons-section">
            <h3>图标集合</h3>
            <div class="icon-specimens">
              <UiIcon v-for="name in iconNames" :key="name" :name="name" :size="22" base="/canteen/icons" />
            </div>
          </section>
          <section class="type-section">
            <h3>字体规范（苹方 SC）</h3>
            <div><strong>标题</strong><span>28 / 加粗</span></div>
            <div><b>大标题</b><span>22 / 加粗</span></div>
            <p>正文 16 / 常规　　辅助 14 / 常规　　说明 12 / 常规</p>
          </section>
        </footer>
      </div>
    </div>
    <div class="preview-toolbar"><span>校园安心餐 · 交互设计预览</span><span class="preview-hint">含午点 · 使用示例数据 · 支付为展示状态</span>
      <nav><a href="?view=mobile">手机端</a><a href="?view=admin">管理后台</a><button @click="revision++">重置预览</button></nav>
    </div>
  </div>
  <div v-else-if="mode === 'mobile'" class="mobile-preview-page">
    <div class="standalone-mobile">
      <CanteenMobile :initial-page="page" />
    </div><a class="return-to-board" href="?view=board">设计总览</a>
  </div>
  <CanteenAdmin v-else :initial-view="page === 'monthly' ? 'monthly' : 'daily'" />
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import CanteenMobile from '../canteen-mobile/components/CanteenMobile.vue'
import UiIcon from '../canteen-mobile/components/UiIcon.vue'
import CanteenAdmin from '../views/canteen/CanteenAdmin.vue'
const params = new URLSearchParams(location.search)
const mode = ref(['mobile','admin'].includes(params.get('view')) ? params.get('view') : 'board')
const page = params.get('page') || 'home'
const revision = ref(0)
const boardZoom = ref(Math.min(1, Math.max(768, window.innerWidth - 16) / 1536))
function resizeBoard() { boardZoom.value = Math.min(1, Math.max(768, window.innerWidth - 16) / 1536) }
onMounted(() => window.addEventListener('resize', resizeBoard))
onBeforeUnmount(() => window.removeEventListener('resize', resizeBoard))
const screens = [{ key: 'home', title: '家长首页' }, { key: 'order', title: '明日订餐' }, { key: 'stop', title: '停餐申请' }, { key: 'rules', title: '停餐规则' }, { key: 'teacher', title: '教师订餐（微信支付）' }, { key: 'records', title: '订餐记录' }]
const colors = [{ hex: '#1F8A5B', name: '主色 · 翡翠绿' }, { hex: '#0E5A3C', name: '深绿' }, { hex: '#E8F5EE', name: '辅助 · 浅绿' }, { hex: '#FF7A45', name: '强调 · 提醒橙' }, { hex: '#FFB837', name: '提醒 · 琥珀黄' }, { hex: '#F5F7FA', name: '中性 · 浅灰' }, { hex: '#E6E7EB', name: '中性 · 灰' }, { hex: '#333333', name: '中性 · 深灰' }]
const iconNames = ['home','calendar','record','user','book','shield','bell','download','filter','wallet','search','edit','check','delete']
</script>
<style>
html,body,#app{margin:0;min-height:100%;font-family:'PingFang SC','Microsoft YaHei',sans-serif}body{background:#fbfaf7}button,a{-webkit-tap-highlight-color:transparent}button{font-family:inherit}.design-preview{color:#23352e;background:radial-gradient(ellipse at 35% 25%,#fffefa,#fcfbf7);min-height:100vh}.board-scroll{overflow-x:auto}.design-board{width:1536px;height:1016px;position:relative;transform-origin:top left}.phone-example,.admin-example{position:absolute}.phone-example h2,.admin-example h2{display:flex;align-items:center;gap:11px;margin:0 0 9px;font-weight:500;font-size:15px;line-height:22px;height:25px;white-space:nowrap}.phone-example h2{padding-left:14px}.phone-example h2 a,.admin-example h2 a{color:inherit;text-decoration:none}.phone-example h2 a:hover,.admin-example h2 a:hover{text-decoration:underline;text-underline-offset:4px}.screen-number{display:inline-flex;align-items:center;justify-content:center;font:600 17px/1 Arial,sans-serif;color:white;width:22px;height:22px;border-radius:50%;background:#139463}.phone-example{top:13px}.phone-1,.phone-5{left:36px}.phone-2,.phone-6{left:282px}.phone-3{left:510px}.phone-4{left:734px}.phone-5,.phone-6{top:469px}.phone-frame{border:1px solid #7d9e9f;border-radius:21px;width:207px;height:414px;overflow:hidden;background:#f7faf8;box-shadow:0 2px 6px #1c4c4330,0 0 0 3px #fff9}.phone-render{width:375px;height:750px;transform:scale(.552);transform-origin:top left}.phone-frame.short{height:356px}.phone-frame.short .phone-render{height:645px}.phone-2 .phone-frame{width:204px}.phone-2 .phone-render{transform:scale(.544);height:762px}.phone-3 .phone-frame{width:202px;height:422px}.phone-3 .phone-render{transform:scale(.539);height:783px}.phone-4 .phone-frame{width:190px;height:422px}.phone-4 .phone-render{transform:scale(.507);height:832px}.phone-6 .phone-frame{width:210px}.phone-6 .phone-render{transform:scale(.56);height:636px}.admin-example{left:955px;width:554px}.daily-example{top:13px}.monthly-example{top:469px}.admin-example h2{margin-bottom:9px}.admin-example h2 span{font-weight:400}.admin-frame{width:552px;height:410px;border:1px solid #a2b5b4;box-shadow:0 2px 6px #1b403628;border-radius:13px;overflow:hidden;background:white}.admin-render{width:1000px;height:742px;transform:scale(.552);transform-origin:top left}.monthly-example .admin-frame{height:358px}.monthly-example .admin-render{height:649px}.design-system{position:absolute;left:26px;top:877px;width:1483px;height:122px;border:1px solid #d7cab6;border-radius:10px;display:grid;grid-template-columns:450px 239px 144px 342px 1fr;box-sizing:border-box;background:#fffcf8b0;overflow:hidden}.design-system>section{padding:8px 13px;border-right:1px solid #ede8df;min-width:0}.design-system>section:last-child{border:0}.design-system h3{font-size:13px;font-weight:500;margin:0 0 9px;color:#333d36}.color-palette{display:grid;grid-template-columns:repeat(8,1fr);gap:10px}.color-swatch{height:43px;border-radius:6px;border:1px solid #00000005;margin-bottom:6px}.color-palette span,.color-palette small{display:block;font-size:8px;color:#777970;line-height:1.8;white-space:nowrap}.color-palette small{font-size:9px;font-family:Arial,sans-serif}.button-specimens{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 13px}.button-specimens button{border:0;background:#e1e3e5;color:#92969b;border-radius:6px;height:28px;font-size:12px;letter-spacing:1px;cursor:pointer}.button-specimens .sample-primary{background:linear-gradient(110deg,#069957,#078153);color:white}.button-specimens .sample-secondary{border:1px solid #66b395;background:#fff;color:#2c7c5f}.button-specimens .sample-text{background:none;color:#2e8060}.button-specimens button:disabled{cursor:not-allowed}.tag-specimens{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.tag-specimens span{font-size:10px;border-radius:5px;padding:4px 6px;text-align:center;border:1px solid transparent;white-space:nowrap}.tag-specimens .ordered{color:#438b64;background:#e9f4e9;border-color:#c9e5ce}.tag-specimens .stopped{color:#ed9b41;background:#fff1dd;border-color:#ffe0b2}.tag-specimens .information{color:#538bba;background:#e8f2f9;border-color:#c5e2f6}.tag-specimens .cancelled{color:#777;background:#ededee;border-color:#dfdfe0}.icon-specimens{display:grid;grid-template-columns:repeat(7,1fr);row-gap:15px;padding-top:3px}.type-section>div{display:flex;gap:45px;align-items:center;margin:0 8px 5px;font-size:13px}.type-section strong{font-size:19px;font-weight:600}.type-section b{font-size:15px;font-weight:500}.type-section p{font-size:9px;white-space:nowrap;margin:8px 8px;color:#797b76}.preview-toolbar{max-width:1483px;margin:0 auto;padding:14px 0 20px;display:flex;align-items:center;gap:20px;color:#425f4c;font-size:13px}.preview-hint{font-size:11px;color:#949b92}.preview-toolbar nav{margin-left:auto;display:flex;gap:20px;align-items:center}.preview-toolbar a,.preview-toolbar button{color:#18784c;text-decoration:none;background:none;border:0;cursor:pointer;font-size:12px}.mobile-preview-page{display:flex;justify-content:center;background:#eaf0ec;min-height:100dvh}.standalone-mobile{width:375px;height:100dvh;min-height:640px;box-shadow:0 0 40px #275b3920}.return-to-board{position:fixed;bottom:20px;left:24px;border:1px solid #cfded4;background:#f9fcfa;color:#247850;padding:7px 12px;border-radius:6px;text-decoration:none;font-size:12px}
@media(min-width:1600px){.design-board{margin-left:auto;margin-right:auto}}@media(max-width:600px){.preview-toolbar{padding:14px;flex-wrap:wrap}.preview-hint{display:none}.mobile-preview-page .standalone-mobile{width:100%;min-height:0}.mobile-preview-page .return-to-board{top:15px;left:10px;bottom:auto;opacity:.45;font-size:9px;padding:4px;z-index:5}.mobile-preview-page .return-to-board:hover{opacity:1}}
</style>
