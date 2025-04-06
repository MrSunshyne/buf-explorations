import { createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { TodoService } from "@protos/gen/ts/protos/v1/todo_connect";
import { CreateTodoRequest, UpdateTodoRequest } from "@protos/gen/ts/protos/v1/todo_pb";

const transport = createGrpcTransport({
  baseUrl: "http://localhost:9000",
  httpVersion: "2",
});

const client = createClient(TodoService, transport);

export const todoApi = {
  async createTodo(data: CreateTodoRequest) {
    const response = await client.createTodo(data);
    if (!response.todo) {
      throw new Error("createTodo response did not contain a todo object.");
    }
    return response.todo;
  },

  async getTodo(id: string) {
    const response = await client.getTodo({ id });
    if (!response.todo) {
      throw new Error("getTodo response did not contain a todo object.");
    }
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
    if (!response.todo) {
      throw new Error("updateTodo response did not contain a todo object.");
    }
    return response.todo;
  },

  async deleteTodo(id: string) {
    await client.deleteTodo({ id });
  }
}; 