FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY pkg ./pkg
COPY internal ./internal
COPY cmd/admin_dashboard ./cmd/admin_dashboard

CMD ["node", "cmd/admin_dashboard/index.js"]