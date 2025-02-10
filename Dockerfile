# Stage 1: Build Stage
FROM node:22-bullseye AS build-stage  

# Çalışma dizinini oluştur
WORKDIR /app

# Gerekli bağımlılıkları yükle
RUN apt-get update && apt-get install -y git bash && rm -rf /var/lib/apt/lists/*

# Bellek yönetimi için Node.js seçenekleri
ENV NODE_OPTIONS="--max_old_space_size=512"

# PNPM yükle ve bağımlılıkları kur
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@9.x && pnpm install --frozen-lockfile

# Proje dosyalarını kopyala
COPY . ./

# Projeyi derle
RUN pnpm build && echo "✅ Build successful 🎉"

# Stage 2: Production Stage
FROM nginx:latest AS production-stage

# Nginx için yapılandırma dosyasını ekle (önceki aşamadan gelen dosya değil!)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Derlenen dosyaları Nginx'in servise koyacağı dizine kopyala
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Portu aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]
