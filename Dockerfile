# Stage 1: Build Stage
FROM node:22-alpine AS build-stage

# Çalışma dizinini oluştur
WORKDIR /app

# Gerekli bağımlılıkları yükle
RUN apk update && apk add --no-cache git bash

# Bellek yönetimi için Node.js seçenekleri
ENV NODE_OPTIONS=--max_old_space_size=8192

# PNPM yükle ve bağımlılıkları kur
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@9.x && corepack enable && pnpm install --frozen-lockfile

# Proje dosyalarını kopyala
COPY . ./

# Projeyi derle
RUN pnpm build
RUN echo "✅ Build successful 🎉"

# Stage 2: Production Stage
FROM nginx:latest AS production-stage

# Nginx için yapılandırma (isteğe bağlı özel ayarlar eklenebilir)
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --chown=nginx:nginx /app/nginx.conf /etc/nginx/conf.d/default.conf

# Portu aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]

RUN echo "🚀 Deploy to Nginx successful 🎉"
