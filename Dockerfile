# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG EMAIL_SERVER_USER
ARG EMAIL_SERVER_PASSWORD
ARG EMAIL_SERVER_HOST
ARG EMAIL_SERVER_PORT
ARG EMAIL_FROM

# Set environment variables from build arguments
ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
ENV NEXTAUTH_URL=${{ secrets.NEXTAUTH_URL }}
ENV NEXTAUTH_SECRET=${{ secrets.NEXTAUTH_SECRET }}
ENV EMAIL_SERVER_USER=${{ secrets.EMAIL_SERVER_USER }}
ENV EMAIL_SERVER_PASSWORD=${{ secrets.EMAIL_SERVER_PASSWORD }}
ENV EMAIL_SERVER_HOST=${{ secrets.EMAIL_SERVER_HOST }}
ENV EMAIL_SERVER_PORT=${{ secrets.EMAIL_SERVER_PORT }}
ENV EMAIL_FROM=${{ secrets.EMAIL_FROM }}

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .


# Build Next.js application
RUN npm run build

# Stage 2: Production runtime
FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["npm", "start"]
