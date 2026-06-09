# ---- Build stage ----
FROM node:20 AS build

WORKDIR /app

# Install dependencies first for better Docker layer caching
COPY package*.json ./
RUN npm install

# Copy all source code and build for production
COPY . ./
RUN npm run build --configuration=production

# ---- Runtime stage ----
FROM nginx:alpine AS runtime

# Copy our custom Nginx config to replace the default one
# This configures Nginx to listen on port 8081 and fallback to index.html for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled Angular artifacts to Nginx's serving directory
# Note: Angular 17+ 'application' builder outputs to dist/[project]/browser
COPY --from=build /app/dist/todo-frontend/browser /usr/share/nginx/html

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
