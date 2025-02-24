FROM node:22-alpine AS frontend-build

# build frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# build backend
FROM node:22-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy backend files
COPY . .

# Copy frontend build
COPY --from=frontend-build /app/dist ./frontend/dist

EXPOSE 5000
ENV NODE_ENV=production

# Use the compiled JavaScript
CMD ["npm", "start"]

