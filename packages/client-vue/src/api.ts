import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { TodoService } from "@buf-explorations/protos/gen/ts/v1/todo_pb";
import type { CreateTodoRequest, UpdateTodoRequest, Todo } from "@buf-explorations/protos/gen/ts/v1/todo_pb";

const transport = createGrpcWebTransport({
  baseUrl: "http://localhost:9000",
  useBinaryFormat: true,
  interceptors: [],
});

const client = createClient(TodoService, transport);

export const todoApi = {
  async createTodo(data: CreateTodoRequest) {
    const response = await client.createTodo(data);
    const todo = (response as unknown as { todo: Todo }).todo;
    if (!todo) {
      throw new Error("createTodo response did not contain a todo object.");
    }
    return todo;
  },

  async getTodo(id: string) {
    const response = await client.getTodo({ id });
    const todo = (response as unknown as { todo: Todo }).todo;
    if (!todo) {
      throw new Error("getTodo response did not contain a todo object.");
    }
    return todo;
  },

  async listTodos() {
    const response = await client.listTodos({
      pageSize: 100,
      pageToken: "",
    });
    return (response as unknown as { todos: Todo[] }).todos;
  },

  async updateTodo(id: string, data: UpdateTodoRequest) {
    const response = await client.updateTodo({
      ...data,
      id,
    });
    const todo = (response as unknown as { todo: Todo }).todo;
    if (!todo) {
      throw new Error("updateTodo response did not contain a todo object.");
    }
    return todo;
  },

  async deleteTodo(id: string) {
    await client.deleteTodo({ id });
  }
};

// Re-export the generated types needed by components
export type { Todo, CreateTodoRequest, UpdateTodoRequest }; 