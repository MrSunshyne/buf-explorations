package main

import (
	"log"
	"net"
	"net/http"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"google.golang.org/grpc"

	"github.com/MrSunshyne/buf-explorations/server/internal/service"
	pb "github.com/MrSunshyne/buf-explorations/protos/gen/go/protos/v1"
)

func main() {
	// Create a new gRPC server
	grpcServer := grpc.NewServer()

	// Register the TodoService
	todoService := service.NewTodoService()
	pb.RegisterTodoServiceServer(grpcServer, todoService)

	// Create a gRPC-Web wrapper around the gRPC server
	wrappedGrpc := grpcweb.WrapServer(grpcServer,
		grpcweb.WithOriginFunc(func(origin string) bool {
			// Allow all origins
			return true
		}),
		grpcweb.WithAllowedRequestHeaders([]string{"*"}),
	)

	// Create a handler that will multiplex between gRPC and gRPC-Web
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if wrappedGrpc.IsGrpcWebRequest(r) || wrappedGrpc.IsAcceptableGrpcCorsRequest(r) {
			log.Printf("Handling as gRPC-Web request: %s %s", r.Method, r.URL.Path)
			wrappedGrpc.ServeHTTP(w, r)
			return
		}

		// Handle as regular gRPC
		log.Printf("Handling as gRPC request: %s %s", r.Method, r.URL.Path)
		grpcServer.ServeHTTP(w, r)
	})

	// Add CORS support
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"grpc-status", "grpc-message"},
		AllowCredentials: true,
	}).Handler(handler)

	// Create a TCP listener
	lis, err := net.Listen("tcp", ":9000")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	// Create an HTTP/2 server
	h2srv := &http2.Server{}

	// Create an HTTP server that supports both HTTP/1.1 and HTTP/2
	srv := &http.Server{
		Handler: h2c.NewHandler(corsHandler, h2srv),
	}

	log.Printf("Starting server on :9000 (supports gRPC, gRPC-Web, and HTTP/2)")
	if err := srv.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
} 