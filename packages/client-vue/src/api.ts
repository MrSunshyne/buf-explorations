import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { TodoService } from "@buf-explorations/protos/gen/ts/v1/todo_pb";
import { create } from "@bufbuild/protobuf";
import type { Todo } from "@buf-explorations/protos/gen/ts/v1/todo_pb";
import { CreateTodoRequestSchema, UpdateTodoRequestSchema } from "@buf-explorations/protos/gen/ts/v1/todo_pb";

type CreateTodoInput = {
  name: string;
  description: string;
};

type UpdateTodoInput = {
  name: string;
  description: string;
  completed: boolean;
};

const transport = createGrpcWebTransport({
  baseUrl: "http://localhost:9000",
  useBinaryFormat: true,
  interceptors: [],
});

const client = createClient(TodoService, transport);

export const todoApi = {
  async createTodo(data: CreateTodoInput) {
    const request = create(CreateTodoRequestSchema, data);
    const response = await client.createTodo(request);
    
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

  async updateTodo(id: string, data: UpdateTodoInput) {
    const request = create(UpdateTodoRequestSchema, {
      ...data,
      id,
    });
    const response = await client.updateTodo(request);
    if (!response.todo) {
      throw new Error("updateTodo response did not contain a todo object.");
    }
    return response.todo;
  },

  async deleteTodo(id: string) {
    await client.deleteTodo({ id });
  }
};

// Re-export the generated types needed by components
export type { Todo, CreateTodoInput, UpdateTodoInput }; 