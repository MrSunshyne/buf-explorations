import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { TodoService } from "../../protos/gen/ts/protos/v1/todo_connect.ts";
import { 
  CreateTodoRequest, 
  DeleteTodoRequest, 
  GetTodoRequest, 
  ListTodosRequest, 
  ListTodosResponse,
  UpdateTodoRequest,
  Todo
} from "../../protos/gen/ts/protos/v1/todo_pb.ts";

// Create a transport with debug logging
const transport = createGrpcWebTransport({
  baseUrl: "http://localhost:8080",
  useBinaryFormat: true,
  interceptors: [
    (next) => async (req) => {
      const { url, method } = req;
      console.log(`🚀 ${method.name} (${url.split('/').pop()})`);
      
      const res = await next(req);
      
      console.log(`✅ ${method.name} completed`);
      return res;
    },
  ],
});

// Create a client
const client = createClient(TodoService, transport);

async function main() {
  try {
    console.log("🔄 Starting client operations...");
    
    // Create a new todo
    console.log("📝 Creating todo...");
    const createResponse = await client.createTodo({
      title: "Learn gRPC",
      description: "Understand how to use gRPC with TypeScript",
    });
    const createdTodo = ((createResponse as unknown) as { todo: Todo }).todo;
    console.log(`✨ Todo created with ID: ${createdTodo.id}`);

    // Get the created todo
    console.log("🔍 Getting todo...");
    const getResponse = await client.getTodo({
      id: createdTodo.id,
    });
    const retrievedTodo = ((getResponse as unknown) as { todo: Todo }).todo;
    console.log(`📋 Todo retrieved`);

    // List all todos
    console.log("📋 Listing todos...");
    const listResponse = await client.listTodos({
      pageSize: 10,
    });
    const todos = ((listResponse as unknown) as ListTodosResponse).todos;
    console.log(`📊 Found ${todos.length} todos`);

    // Update the todo
    console.log("✏️ Updating todo...");
    const updateResponse = await client.updateTodo({
      id: createdTodo.id,
      title: "Learn gRPC - Updated",
      description: "Understanding how to use gRPC with TypeScript - Completed!",
      completed: true,
    });
    const updatedTodo = ((updateResponse as unknown) as { todo: Todo }).todo;
    console.log(`🔄 Todo updated`);

    // Delete the todo
    console.log("🗑️ Deleting todo...");
    await client.deleteTodo({
      id: createdTodo.id,
    });
    console.log("🗑️ Todo deleted");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main(); 