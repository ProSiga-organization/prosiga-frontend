FROM node:20-slim
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs
USER nextjs

CMD ["npm", "start"]