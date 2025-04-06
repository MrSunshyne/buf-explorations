package service

import (
	"context"
	"log"

	"github.com/google/uuid"
	pb "github.com/MrSunshyne/buf-explorations/protos/gen/go/v1"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// TodoService implements the TodoService interface
type TodoService struct {
	pb.UnimplementedTodoServiceServer
	todos map[string]*pb.Todo
}

// NewTodoService creates a new TodoService instance
func NewTodoService() *TodoService {
	return &TodoService{
		todos: make(map[string]*pb.Todo),
	}
}

// CreateTodo creates a new todo
func (s *TodoService) CreateTodo(ctx context.Context, req *pb.CreateTodoRequest) (*pb.CreateTodoResponse, error) {
	log.Printf("CreateTodo request: %+v", req)
	id := uuid.New().String()
	now := timestamppb.Now()
	
	todo := &pb.Todo{
		Id:          id,
		Name:        req.Name,
		Description: req.Description,
		Completed:   false,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	
	s.todos[id] = todo
	log.Printf("Created todo: %+v", todo)
	return &pb.CreateTodoResponse{
		Todo: todo,
	}, nil
}

// GetTodo retrieves a todo by ID
func (s *TodoService) GetTodo(ctx context.Context, req *pb.GetTodoRequest) (*pb.GetTodoResponse, error) {
	log.Printf("GetTodo request: %+v", req)
	todo, exists := s.todos[req.Id]
	if !exists {
		log.Printf("Todo not found: %s", req.Id)
		return nil, status.Errorf(codes.NotFound, "todo not found: %s", req.Id)
	}
	log.Printf("Retrieved todo: %+v", todo)
	return &pb.GetTodoResponse{
		Todo: todo,
	}, nil
}

// ListTodos lists all todos with pagination
func (s *TodoService) ListTodos(ctx context.Context, req *pb.ListTodosRequest) (*pb.ListTodosResponse, error) {
	log.Printf("ListTodos request: %+v", req)
	pageSize := req.PageSize
	if pageSize <= 0 {
		pageSize = 10 // default page size
	}
	
	todos := make([]*pb.Todo, 0, len(s.todos))
	for _, todo := range s.todos {
		todos = append(todos, todo)
	}
	
	// Simple pagination implementation
	start := 0
	if req.PageToken != "" {
		// In a real implementation, you'd decode the page token
		// and use it to determine the start index
	}
	
	end := start + int(pageSize)
	if end > len(todos) {
		end = len(todos)
	}
	
	response := &pb.ListTodosResponse{
		Todos:         todos[start:end],
		NextPageToken: "", // In a real implementation, you'd encode the next page token
	}
	log.Printf("ListTodos response: %+v", response)
	return response, nil
}

// UpdateTodo updates an existing todo
func (s *TodoService) UpdateTodo(ctx context.Context, req *pb.UpdateTodoRequest) (*pb.UpdateTodoResponse, error) {
	log.Printf("UpdateTodo request: %+v", req)
	todo, exists := s.todos[req.Id]
	if !exists {
		log.Printf("Todo not found during update: %s", req.Id)
		return nil, status.Errorf(codes.NotFound, "todo not found: %s", req.Id)
	}
	
	todo.Name = req.Name
	todo.Description = req.Description
	todo.Completed = req.Completed
	todo.UpdatedAt = timestamppb.Now()
	
	log.Printf("Updated todo: %+v", todo)
	return &pb.UpdateTodoResponse{
		Todo: todo,
	}, nil
}

// DeleteTodo deletes a todo
func (s *TodoService) DeleteTodo(ctx context.Context, req *pb.DeleteTodoRequest) (*pb.DeleteTodoResponse, error) {
	log.Printf("DeleteTodo request: %+v", req)
	if _, exists := s.todos[req.Id]; !exists {
		log.Printf("Todo not found during delete: %s", req.Id)
		// Return NotFound if trying to delete something that doesn't exist
		return nil, status.Errorf(codes.NotFound, "todo not found: %s", req.Id)
	}
	
	delete(s.todos, req.Id)
	log.Printf("Deleted todo with ID: %s", req.Id)
	return &pb.DeleteTodoResponse{}, nil
}