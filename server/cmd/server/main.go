package main

import (
	"context"
	"log"
	"net"
	"net/http"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "github.com/MrSunshyne/buf-explorations/server/gen/todo/v1"
	"github.com/MrSunshyne/buf-explorations/server/internal/service"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request: %s %s", r.Method, r.URL.Path)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Max-Age", "3600")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Create a new gRPC server
	grpcServer := grpc.NewServer()

	// Register the TodoService
	todoService := service.NewTodoService()
	pb.RegisterTodoServiceServer(grpcServer, todoService)

	// Start gRPC server on port 9000
	go func() {
		log.Printf("Starting gRPC server on :9000")
		lis, err := net.Listen("tcp", ":9000")
		if err != nil {
			log.Fatalf("Failed to listen: %v", err)
		}
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("Failed to serve gRPC: %v", err)
		}
	}()

	// Create a new gRPC-Gateway mux for REST
	gwmux := runtime.NewServeMux()
	ctx := context.Background()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	err := pb.RegisterTodoServiceHandlerFromEndpoint(ctx, gwmux, "localhost:9000", opts)
	if err != nil {
		log.Fatalf("Failed to register gateway: %v", err)
	}

	// Start HTTP server with CORS middleware on port 8081
	log.Printf("Starting HTTP server on :8081")
	if err := http.ListenAndServe(":8081", corsMiddleware(gwmux)); err != nil {
		log.Fatalf("Failed to serve HTTP: %v", err)
	}
} 