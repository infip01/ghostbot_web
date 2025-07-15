# Multi-stage Dockerfile for React Frontend + Flask Backend

# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY frontend/ ./

# Build the React application
RUN npm run build

# Stage 2: Python Backend with Frontend Assets
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY *.py ./
COPY templates/ ./templates/
COPY static/ ./static/

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist ./static/dist/

# Create directory for uploaded files and blocked IPs
RUN mkdir -p uploads && touch blocked_ips.txt

# Expose port
EXPOSE 1218

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:1218/ || exit 1

# Run the application
CMD ["python", "app.py"]