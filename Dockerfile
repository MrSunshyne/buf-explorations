# syntax=docker/dockerfile:1

# ---- Builder Stage ----
FROM golang:1.21-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the Go workspace file first (assuming it's at the root)
COPY go.work ./
# COPY go.work.sum ./ # Uncomment if go work sync generates this file

# Copy go.mod and go.sum for the server module
COPY server/go.mod server/go.sum ./server/

# Copy the entire source code needed for the build
COPY protos/ ./protos/
COPY server/ ./server/

# Explicitly set WORKDIR to /app where go.work is located
WORKDIR /app

# Download dependencies (will respect go.work)
# Run from /app context where go.work is
RUN go mod download # Removed invalid -workfile flag

# Build the application from the workspace root
# Output the binary to the root for easy copying
RUN go build -o /server ./server/cmd/server

# ---- Final Stage ----
FROM alpine:latest

# Set working directory in the final image
WORKDIR /

# Copy the built binary from the builder stage
COPY --from=builder /server /server

# Expose port (adjust if your server uses a different port)
EXPOSE 8080

# Command to run the executable
ENTRYPOINT ["/server"] 