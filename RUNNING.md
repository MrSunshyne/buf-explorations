# Running the Application

This project uses Docker Compose to run the server and Envoy proxy. The configuration is designed to work on both macOS and Linux environments with platform-specific optimizations.

## Quick Start (Recommended)

Use the npm scripts that automatically detect your platform:

```bash
# Start containers (auto-detects Linux vs non-Linux)
pnpm start

# Run tests
pnpm test

# Stop containers
pnpm stop

# Restart containers (stop and start)
pnpm restart
```

## Platform-Specific Setup (Manual)

### For macOS

On macOS, Docker runs in a VM, making `network_mode: "host"` ineffective. The default configuration uses Docker's internal networking where containers communicate via service names:

```bash
# Start the services
pnpm run start:default
# or
docker compose up -d

# Run the tests
pnpm test
# or
pnpm --filter tests test
```

### For Linux

On Linux, you can use host networking mode for better performance with a special configuration:

```bash
# Start the services with host networking
pnpm run start:linux
# or
docker compose -f docker-compose.yml -f docker-compose.linux.yml up -d

# Run the tests
pnpm test
# or
pnpm --filter tests test
```

## How It Works

The configuration uses two different setups:

1. **Default (macOS) configuration**:
   - Containers run on Docker's bridge network
   - Envoy connects to the server using the service name: `server:9000`
   - Ports are mapped to the host machine

2. **Linux configuration (with override file)**:
   - Containers run with `network_mode: "host"`
   - An alternative Envoy configuration connects to `localhost:9000`
   - Uses Docker Compose's override pattern to modify settings

## Troubleshooting

If you encounter connection issues:

1. Verify the containers are running:
   ```bash
   docker ps
   ```

2. Check container logs:
   ```bash
   docker logs buf-explorations-server-1
   docker logs buf-explorations-envoy-1
   ```

3. Ensure ports are accessible:
   ```bash
   curl -v http://localhost:8080
   ```

4. On Linux, make sure ports are not already in use:
   ```bash
   netstat -tuln | grep -E '8080|9000|9901'
   ```

## Architecture

- **Envoy Proxy**: Runs on port 8080, handles HTTP/gRPC-Web requests
- **Server**: Runs on port 9000 (gRPC) and 8081 (HTTP)
- **Tests**: Connect to the server through Envoy on port 8080 