# ==============================================================================
# SECURE MULTI-STAGE DOCKERFILE FOR DEVSECOPS PIPELINE
# Adheres to CIS Docker Benchmark & OWASP Container Security Guidelines
# ==============================================================================

# STAGE 1: Dependency Builder
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

# Copy dependency specifications only for cache efficiency
COPY package*.json ./

# Install production dependencies cleanly (deterministic lockfile)
RUN npm ci --only=production && npm cache clean --force

# ------------------------------------------------------------------------------
# STAGE 2: Hardened Runtime Container
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=3000

# Security Hardening: Ensure dumb-init or clean non-root user execution
# node:20-alpine includes non-root user 'node' (UID/GID 1000)
COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node src/ ./src/

# Security Control: Drop root privileges before starting process
USER node

# Expose microservice port
EXPOSE 3000

# Healthcheck configuration for container orchestration monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
