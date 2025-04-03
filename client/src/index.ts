import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { TodoService } from "@protos/v1/todo_connect";
import { 
  CreateTodoRequest, 
  DeleteTodoRequest, 
  GetTodoRequest, 
  ListTodosRequest, 
  ListTodosResponse,
  UpdateTodoRequest,
  Todo
} from "@protos/v1/todo_pb";

// Create a transport with debug logging
const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
  useHttpGet: true,
  interceptors: [
    (next) => async (req) => {
      console.log("Sending request:", {
        url: req.url,
        method: req.method,
        headers: req.header,
      });
      const res = await next(req);
      console.log("Received response:", {
        headers: res.header,
      });
      return res;
    },
  ],
});

// Create a client
const client = createClient(TodoService, transport);

async function main() {
  try {
    console.log("Starting client operations...");
    
    // Create a new todo
    console.log("Creating todo...");
    const createResponse = await client.createTodo({
      title: "Learn gRPC",
      description: "Understand how to use gRPC with TypeScript",
    });
    const createdTodo = ((createResponse as unknown) as { todo: Todo }).todo;
    console.log("Created todo:", createdTodo);

    // Get the created todo
    console.log("Getting todo...");
    const getResponse = await client.getTodo({
      id: createdTodo.id,
    });
    const retrievedTodo = ((getResponse as unknown) as { todo: Todo }).todo;
    console.log("Retrieved todo:", retrievedTodo);

    // List all todos
    console.log("Listing todos...");
    const listResponse = await client.listTodos({
      pageSize: 10,
    });
    const todos = ((listResponse as unknown) as ListTodosResponse).todos;
    console.log("List of todos:", todos);

    // Update the todo
    console.log("Updating todo...");
    const updateResponse = await client.updateTodo({
      id: createdTodo.id,
      title: "Learn gRPC - Updated",
      description: "Understanding how to use gRPC with TypeScript - Completed!",
      completed: true,
    });
    const updatedTodo = ((updateResponse as unknown) as { todo: Todo }).todo;
    console.log("Updated todo:", updatedTodo);

    // Delete the todo
    console.log("Deleting todo...");
    await client.deleteTodo({
      id: createdTodo.id,
    });
    console.log("Deleted todo");

  } catch (error) {
    console.error("Error:", error);
  }
}

main(); 