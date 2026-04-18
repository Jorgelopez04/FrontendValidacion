# Etapa 1: Construcción (Build)
# Etapa 1: Construcción (Build) usando Node 20
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código y generar el bundle de producción
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copiar el bundle desde la etapa anterior a la carpeta de Nginx
# OJO: Cambia 'frontend-tailorflow' por el nombre real de tu carpeta en /dist
COPY --from=build /app/dist/frontend-tailorflow /usr/share/nginx/html

# Copiar configuración personalizada de Nginx para manejar rutas de Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]