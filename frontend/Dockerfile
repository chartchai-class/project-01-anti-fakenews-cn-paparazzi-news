# 构建阶段
FROM node:18-alpine AS build

WORKDIR /app

# 安装构建工具
RUN apk add --no-cache python3 make g++

# 复制依赖文件并安装，使用--legacy-peer-deps避免依赖冲突
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 确保vite可执行
RUN npm install -g vite

# 复制所有源代码
COPY . .

# 构建应用
RUN npm run build

# 部署阶段
FROM nginx:alpine

# 复制构建产物到Nginx目录
COPY --from=build /app/dist /usr/share/nginx/html

# 配置Nginx以支持SPA路由
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]