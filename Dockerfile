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

# Change to the server module directory
WORKDIR /app/server

# Download dependencies (will respect go.work)
# This benefits from caching if go.mod/go.sum/go.work haven't changed
# RUN go mod download

# Build the application
# Output the binary to the root for easy copying
RUN go build -o /server ./cmd/server

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