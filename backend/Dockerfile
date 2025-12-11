FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY backend ./backend
RUN npm run backend:build
ENV PORT=4000
EXPOSE 4000
CMD ["npm","run","backend:start"]
