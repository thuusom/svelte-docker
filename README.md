# Svelte Docker

A static Svelte application containerized with Docker for both development and production environments.

## Purpose

This project demonstrates how to containerize a Svelte application using Docker, with separate configurations for development and production builds. The application is built as a static site and served using Nginx.

## Project Structure

```
├── docker/
│   ├── Dockerfile.dev      # Development Docker configuration
│   └── Dockerfile.prod     # Production Docker configuration
├── nginx/
│   └── nginx.conf          # Nginx configuration for serving static files
├── src/                    # Svelte application source code
├── docker-compose.dev.yml  # Development Docker Compose configuration
├── docker-compose.prod.yml # Production Docker Compose configuration
├── svelte.config.js        # Svelte configuration with static adapter
└── .dockerignore           # Docker ignore file
```

## Configuration Files

### svelte.config.js
```javascript
import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html' // SPA fallback for client-side routing
    }),
    prerender: { entries: [] },
  },
};
```

### nginx.conf
```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        # serve files, then dirs, then fall back to SPA entry
        try_files $uri $uri/ /index.html;
    }
}
```

### .dockerignore
The `.dockerignore` file excludes unnecessary files from the Docker build context:
- `node_modules` (installed separately in container)
- Build artifacts (`build`, `.svelte-kit`)
- Development files (`.git`, `.vscode`, etc.)
- Configuration files (`.env`, `.prettierrc`, etc.)

## Building and Running

### Development Environment

Build and run the development container:

```bash
# Build and start development container
docker compose -f docker-compose.dev.yml up --build

# Run in detached mode
docker compose -f docker-compose.dev.yml up --build -d
```

The application will be available at `http://localhost:8080`

### Production Environment

Build and run the production container:

```bash
# Build and start production container
docker compose -f docker-compose.prod.yml up --build

# Run in detached mode
docker compose -f docker-compose.prod.yml up --build -d
```

The application will be available at `http://localhost:8080`

### Manual Docker Commands

You can also build and run containers manually:

```bash
# Development build
docker build -f docker/Dockerfile.dev -t svelte-dev .

# Production build
docker build -f docker/Dockerfile.prod -t svelte-prod .

# Run development container
docker run -p 8080:8080 svelte-dev

# Run production container
docker run -p 8080:8080 svelte-prod
```

## Docker Configuration Details

### Development Dockerfile (docker/Dockerfile.dev)
- Uses Node.js 22.12.0-slim as base image
- Multi-stage build with separate install and build stages
- Installs all dependencies (including dev dependencies)
- Builds the application in development mode
- Serves static files using Nginx on port 8080

### Production Dockerfile (docker/Dockerfile.prod)
- Uses Node.js 22.12.0-slim as base image
- Multi-stage build optimized for production
- Installs only production dependencies
- Builds the application in production mode
- Serves static files using Nginx on port 8080

### Key Features
- **Static Site Generation**: Uses `@sveltejs/adapter-static` for generating static files
- **SPA Support**: Nginx configured with fallback to `index.html` for client-side routing
- **Multi-stage Builds**: Optimized Docker images with separate build and runtime stages
- **Security**: Uses unprivileged Nginx container
- **Port Configuration**: Application runs on port 8080 (configurable)

## Development

For local development without Docker:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Stopping Containers

```bash
# Stop development environment
docker compose -f docker-compose.dev.yml down

# Stop production environment
docker compose -f docker-compose.prod.yml down
```
