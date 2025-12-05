# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json .
# Copy package-lock.json if exists, otherwise ignore warning
COPY package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built assets from the build stage
COPY --from=build /app/build /usr/share/nginx/html
# Copy Nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
