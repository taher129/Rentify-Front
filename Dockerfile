# Stage 1: Build the Angular app
FROM node:alpine AS build

WORKDIR /app

# Copy and install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install  --legacy-peer-deps  @mediapipe/face_mesh

# Copy the rest of the application
COPY . .

# Build with production configuration
RUN npm run build --configuration=production

# Stage 2: Serve the Angular app with Nginx
FROM nginx:stable-alpine

# Copy built Angular app to Nginx web root
COPY --from=build /app/dist/rentify-front/browser /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Set permissions for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
