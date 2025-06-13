# FROM node:18.20.4-alpine
#FROM node:20-alpine
FROM node:22.12-alpine
ENV TZ=Asia/Shanghai
RUN ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


RUN apk add --no-cache openssl

# 添加项目文件
WORKDIR /app
# 设置为淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com/
# 安装pnpm
RUN npm install -g pnpm
COPY package*.json ./
# 设置为淘宝镜像源
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install

COPY . .


# 生成 Prisma 客户端
RUN pnpm prisma:generate

RUN pnpm build

# 启动命令
CMD ["sh", "-c", "pnpm prisma:deploy && pnpm start:prod"]
# 暴露端口
EXPOSE 3000
