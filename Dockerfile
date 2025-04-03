FROM golang:1.21-alpine

WORKDIR /app

# Copy go.mod and go.sum from server directory
COPY server/go.mod server/go.sum ./
RUN go mod download

# Copy the source code from server directory
COPY server/ .

# Build the application
RUN go build -o server ./cmd/server

# Run the server
CMD ["./server"] 