# Nest 启动模板

## 后端

### 模块

已内置user模块，包括token解析具体需要自己再改，可以使用@GetMeta获取token的userId，详见 util/meta.util.ts 

### 技术栈

- nest.js
- swagger
- prisma

### 如何启动

```bash
pnpm install 
pnpm start:dev
```

### 如何构建

```bash
# 写入 .env.production 后
pnpm build
```

### prisma的使用

可能需要全局安装prisma

```bash
# 如果需要重新构建表结构
pnpm prisma:migrate # 会根据src/db/prisma进行构建

# 部署 prisma：
# 写入配置 .env.xx 中的 SQLITE_URL
pnpm prisma:deploy 
```

### 部署

#### docker 
构建镜像
```
docker build -t nest-web-starter:latest .
```
docker-compose启动
```
docker-compose -p nest-web up -d
```