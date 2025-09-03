# Stage 1: build React
FROM node:20.17.0-alpine as build

WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve with Nginx
FROM nginx:alpine
COPY --from=build /frontend/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]