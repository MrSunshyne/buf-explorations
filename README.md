# Buf Explorations

This project demonstrates a modern full-stack application using Buf, gRPC, and TypeScript. It implements a simple Todo service with both gRPC and REST APIs, fronted by an Envoy proxy for gRPC-Web support.

## Project Structure

```
.
├── server/           # Go server implementation
│   ├── cmd/         # Server entry points
│   ├── internal/    # Internal server code
│   └── gen/         # Generated gRPC code
├── client/          # TypeScript client
│   └── src/         # Client source code
├── todo/            # Proto definitions
│   └── v1/          # Version 1 of the API
├── tests/           # Integration tests
├── Dockerfile       # Dockerfile for the Go server
├── docker-compose.yml # Docker Compose file for server + Envoy
└── envoy.yaml       # Envoy proxy configuration
```

## Features

- **Go gRPC Server**: Implements a Todo service with CRUD operations.
- **gRPC-Gateway**: Provides REST API endpoints alongside gRPC.
- **Envoy Proxy**: Handles gRPC-Web translation and CORS, serving traffic on port 8080.
- **TypeScript Client**: Type-safe client using Connect.
- **Integration Tests**: Full test suite for the API.
- **Modern Tooling**: Uses Buf for proto management, pnpm for package management, and Docker for containerization.

## Prerequisites

- Go 1.21 or later (for local development/code generation)
- Node.js 18 or later
- pnpm (package manager)
- Buf CLI
- Docker
- Docker Compose (v2 - `docker compose` command)

## Getting Started

1.  Install dependencies:
    ```bash
    pnpm install
    ```

2.  Start the server and Envoy proxy:
    ```bash
    # Ensure no other services are running on ports 8080 or 9000
    docker compose up --build
    ```
    The services will run in the foreground. Use `-d` to run in detached mode.

3.  Run the tests (in a separate terminal):
    ```bash
    pnpm --filter tests test
    ```

## API Endpoints

The service is exposed via the Envoy proxy on **port 8080**:

-   **gRPC-Web**: Clients connect to `http://localhost:8080` using gRPC-Web (binary format).
-   **REST**: The gRPC-Gateway REST API is also available at `http://localhost:8080`.

Envoy proxies requests to the backend Go gRPC server running internally on port 9000.

### REST API (via Envoy on port 8080)

-   `POST /v1/todos` - Create a todo
-   `GET /v1/todos/{id}` - Get a todo by ID
-   `GET /v1/todos` - List todos
-   `PATCH /v1/todos/{id}` - Update a todo
-   `DELETE /v1/todos/{id}` - Delete a todo

### gRPC API

The gRPC service is defined in `todo/v1/todo.proto` and includes the following methods:
-   `CreateTodo`
-   `GetTodo`
-   `ListTodos`
-   `UpdateTodo`
-   `DeleteTodo`

## Development

### Generating Code

Ensure you have the correct Go plugins installed (`protoc-gen-go` v1.31.0, `protoc-gen-go-grpc` v1.3.0, `protoc-gen-grpc-gateway` v2.18.1) and the Node plugins (`@bufbuild/protoc-gen-es`, `@connectrpc/protoc-gen-connect-es`) available via `node_modules/.bin`.

To regenerate the gRPC code after modifying the proto files:

```bash
# Ensure Go binaries and local node_modules are in PATH
export PATH="$(pwd)/node_modules/.bin:$HOME/go/bin:$PATH"
buf generate
```

### Running Tests

Ensure the server and Envoy are running via `docker compose up`.

```bash
pnpm --filter tests test        # Run tests once from the root
pnpm --filter tests test:watch  # Run tests in watch mode from the root
pnpm --filter tests test:coverage # Run tests with coverage from the root
```

## Project Goals

1.  Demonstrate Buf's modern proto workflow
2.  Show how to implement a service with both gRPC and REST APIs
3.  Provide examples of type-safe client implementation using Connect
4.  Illustrate using Envoy for gRPC-Web translation
5.  Showcase integration testing practices for gRPC services

## Contributing

1.  Fork the repository
2.  Create your feature branch
3.  Commit your changes
4.  Push to the branch
5.  Create a new Pull Request

## License

This project is MIT licensed. See the LICENSE file for details. 