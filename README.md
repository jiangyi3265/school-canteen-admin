# school-canteen-admin

校园安心餐系统的 Vue 3 管理后台，用于查看订餐与停餐数据、月度统计及菜谱运营信息。

## 项目简介

本仓库面向学校食堂运营人员和系统管理员。页面包含每日用餐汇总、班级明细、午餐/午点/晚餐统计、月度报表、CSV 导出、菜品与菜谱入口、班级和角色管理入口，并提供与用户端设计一致的交互预览。当前食堂看板使用示例数据，后续可通过 `school-canteen-backend` 接入真实业务数据。

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

开发环境默认通过 `/dev-api` 访问后端。首次运行可将 `.env.development.example` 复制为 `.env.development` 后按实际部署地址修改代理配置。独立查看校园安心餐设计总览可运行：

```bash
npm run dev:canteen
```

生产构建使用 `npm run build:prod`，设计预览构建使用 `npm run build:canteen`。

## 项目结构

```text
src/views/canteen/       食堂每日统计、月报和管理入口
src/canteen-mobile/      设计预览使用的用户端组件快照与示例数据
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