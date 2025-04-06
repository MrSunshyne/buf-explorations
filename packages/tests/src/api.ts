import { createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { TodoService } from "@buf-explorations/protos/gen/ts/v1/todo_pb";
import { CreateTodoRequest, UpdateTodoRequest } from "@buf-explorations/protos/gen/ts/v1/todo_pb";

const transport = createGrpcTransport({
  baseUrl: "http://localhost:9000"
});

const client = createClient(TodoService, transport);

export const todoApi = {
  async createTodo(data: CreateTodoRequest) {
    const response = await client.createTodo(data);
    if (!response.todo) throw new Error("No todo in response");
    return response.todo;
  },

  async getTodo(id: string) {
    const response = await client.getTodo({ id });
    if (!response.todo) throw new Error("No todo in response");
    return response.todo;
  },

  async listTodos() {
    const response = await client.listTodos({
      pageSize: 100,
      pageToken: "",
    });
    return response.todos;
  },

  async updateTodo(id: string, data: UpdateTodoRequest) {
    const response = await client.updateTodo({
      ...data,
      id,
    });
    if (!response.todo) throw new Error("No todo in response");
    return response.todo;
  },

  async deleteTodo(id: string) {
    await client.deleteTodo({ id });
  }
}; 