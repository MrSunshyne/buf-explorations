# Buf Explorations

This project demonstrates a modern full-stack application using Buf, gRPC, and TypeScript. It implements a simple Todo service with both gRPC and REST APIs.

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
└── tests/           # Integration tests
```

## Features

- **Go gRPC Server**: Implements a Todo service with CRUD operations
- **gRPC-Gateway**: Provides REST API endpoints alongside gRPC
- **TypeScript Client**: Type-safe client using Connect
- **Integration Tests**: Full test suite for the API
- **Modern Tooling**: Uses Buf for proto management and pnpm for package management

## Prerequisites

- Go 1.21 or later
- Node.js 18 or later
- pnpm (package manager)
- Buf CLI

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the server:
   ```bash
   cd server
   pnpm dev
   ```

3. Run the tests:
   ```bash
   cd tests
   pnpm test
   ```

## API Endpoints

The service exposes both gRPC (port 9000) and REST (port 8080) endpoints:

### REST API

- `POST /v1/todos` - Create a todo
- `GET /v1/todos/{id}` - Get a todo by ID
- `GET /v1/todos` - List todos
- `PATCH /v1/todos/{id}` - Update a todo
- `DELETE /v1/todos/{id}` - Delete a todo

### gRPC API

The gRPC service is defined in `todo/v1/todo.proto` and includes the following methods:
- `CreateTodo`
- `GetTodo`
- `ListTodos`
- `UpdateTodo`
- `DeleteTodo`

## Development

### Generating Code

To regenerate the gRPC code after modifying the proto files:

```bash
buf generate
```

### Running Tests

```bash
cd tests
pnpm test        # Run tests once
pnpm test:watch  # Run tests in watch mode
pnpm test:coverage # Run tests with coverage
```

## Project Goals

1. Demonstrate Buf's modern proto workflow
2. Show how to implement a service with both gRPC and REST APIs
3. Provide examples of type-safe client implementation
4. Showcase integration testing practices

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is MIT licensed. See the LICENSE file for details. 