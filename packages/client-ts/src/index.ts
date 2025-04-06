import { createGrpcTransport } from "@connectrpc/connect-node";
import { createClient } from "@connectrpc/connect";
import { TodoService } from "@buf-explorations/protos/gen/ts/v1/todo_pb";

// Create a transport with debug logging
const transport = createGrpcTransport({
  baseUrl: "http://localhost:9000",
  interceptors: [
    (next) => async (req) => {
      const { service, method } = req;
      console.log(`🚀 ${service.typeName}.${method.name}`);
      
      const res = await next(req);
      
      console.log(`✅ ${service.typeName}.${method.name} completed`);
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
      name: "Learn gRPC",
      description: "Understand how to use gRPC with TypeScript",
    });
    console.log(`✨ Todo created with ID: ${createResponse.todo?.id}`);

    if (!createResponse.todo) {
      throw new Error("Failed to create todo");
    }

    // Get the created todo
    console.log("🔍 Getting todo...");
    const getResponse = await client.getTodo({
      id: createResponse.todo.id,
    });
    console.log(`📋 Todo retrieved`);

    // List all todos
    console.log("📋 Listing todos...");
    const listResponse = await client.listTodos({
      pageSize: 10,
    });
    console.log(`📊 Found ${listResponse.todos.length} todos`);

    // Update the todo
    console.log("✏️ Updating todo...");
    const updateResponse = await client.updateTodo({
      id: createResponse.todo.id,
      name: "Learn gRPC - Updated",
      description: "Understanding how to use gRPC with TypeScript - Completed!",
      completed: true,
    });
    console.log(`🔄 Todo updated`);

    // Delete the todo
    console.log("🗑️ Deleting todo...");
    await client.deleteTodo({
      id: createResponse.todo.id,
    });
    console.log("🗑️ Todo deleted");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main(); 