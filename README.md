# 全栈电商管理平台 - 前端

基于 React + TypeScript + Ant Design 的电商管理平台前端，配合后端 API 实现完整的管理功能。

## 技术栈

- React 18 + TypeScript
- Vite 构建工具
- Ant Design 组件库
- React Router 路由管理
- Axios 请求封装

## 功能页面

- 登录页 — 用户认证，JWT Token 管理
- 数据总览 — 商品/订单/用户/收入统计卡片
- 商品管理 — 表格展示、新增/编辑/删除、搜索、分页
- 订单管理 — 订单列表、状态变更
- 用户管理 — 用户列表、角色分配

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认运行在 http://localhost:5173

### 注意

需要先启动后端服务（端口 3000），前端会请求 http://localhost:3000/api
