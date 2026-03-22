# Stage 1: Build the frontend
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:22-slim
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy server-side code and necessary files for tsx
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src/db ./src/db
COPY --from=builder /app/src/types.ts ./src/types.ts
COPY --from=builder /app/src/mockData.ts ./src/mockData.ts
COPY --from=builder /app/tsconfig.json ./

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the application using tsx as defined in package.json
CMD ["npm", "start"]
