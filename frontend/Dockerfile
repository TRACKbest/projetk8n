# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
ENV CI=true

COPY package*.json ./
# Use npm ci when lockfile is in sync; fall back to npm install otherwise.
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

COPY . .

ARG REACT_APP_API_URL=""
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# --- Runtime stage ---
FROM nginx:1.27-alpine AS runtime

# Non-root hardening: nginx:alpine already ships an unprivileged config;
# we only replace the server block.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
