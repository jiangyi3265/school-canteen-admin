# school-canteen-admin

校园安心餐系统的 Vue 3 管理后台，用于查看订餐与停餐数据、月度统计及菜谱运营信息。

## 项目简介

本仓库面向学校食堂运营人员和系统管理员。页面包含每日用餐汇总、班级明细、午餐/午点/晚餐统计、月度筛选与 CSV 导出、菜谱在线修改、财务配置、班级和角色资料。独立运行页面已接入 `school-canteen-backend`：用户端订餐、停餐和教师测试支付会反映到管理端，管理端修改菜谱后用户端会读取新数据；设计总览模式继续使用固定数据以保持评审画面稳定。

## 技术栈

- Vue 3、Vue Router 4、Pinia
- Vite 6、Sass
- Element Plus、Element Plus Icons
- Axios
- ECharts 5
- RuoYi-Vue3 3.9.1 前端基础

## 关联仓库

| 项目 | 说明 | GitHub |
| --- | --- | --- |
| school-canteen-backend | 后端服务 | [school-canteen-backend](https://github.com/jiangyi3265/school-canteen-backend) |
| school-canteen-admin | 管理后台 | [school-canteen-admin](https://github.com/jiangyi3265/school-canteen-admin) |
| school-canteen-app | 用户端 | [school-canteen-app](https://github.com/jiangyi3265/school-canteen-app) |

## 快速启动

```bash
npm ci
npm run dev
```

开发环境默认通过 `/dev-api` 代理到 `http://127.0.0.1:8080`。如果后端使用其他端口，可以先设置 `CANTEEN_API_TARGET`。独立查看校园安心餐页面可运行：

```bash
npm run dev:canteen
```

例如后端运行在 `18083`：

```powershell
$env:CANTEEN_API_TARGET = 'http://127.0.0.1:18083'
npm run dev:canteen
```

打开 `/canteen.html?view=mobile` 查看用户端，打开 `/canteen.html?view=admin` 查看实时管理端，打开 `/canteen.html` 查看固定设计总览。

生产构建使用 `npm run build:prod`，设计预览构建使用 `npm run build:canteen`。

## 项目结构

```text
src/views/canteen/       食堂每日统计、月报和管理入口
src/canteen-mobile/      用户端组件快照、接口封装与设计数据
src/api/                 RuoYi 后端接口封装
src/layout/              管理后台整体布局
src/router/              路由配置
src/store/               Pinia 状态管理
public/canteen/          食堂界面图片与图标资源
vite/                    Vite 插件与构建辅助逻辑
canteen.html             独立设计总览入口
```

## 简历描述示例

参与校园安心餐运营管理后台开发，基于 Vue 3、Vite、Element Plus 与 ECharts 实现每日订餐/停餐汇总、班级明细、月度趋势和报表导出，并统一管理端与用户端的视觉规范。

## 开源说明

本项目基于 RuoYi-Vue3 开源项目二次开发，原项目许可证见 [LICENSE](LICENSE)。
