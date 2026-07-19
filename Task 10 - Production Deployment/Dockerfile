# --- Build Frontend ---
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
# Build the client statically
RUN npm run build

# --- Build & Run Backend ---
FROM node:18-alpine
WORKDIR /app/server
# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

COPY server/package*.json ./
RUN npm install --only=production
COPY server/ ./

# Copy built frontend client assets to expected directory for static serving
COPY --from=client-builder /app/client/dist /app/client/dist

EXPOSE 5000
CMD ["node", "server.js"]
