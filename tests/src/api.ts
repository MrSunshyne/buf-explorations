import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { TodoService } from "../../client/src/gen/todo/v1/todo_connect";
import type { Todo as GeneratedTodo } from "../../client/src/gen/todo/v1/todo_pb";
import { CreateTodoRequest, UpdateTodoRequest } from "../../client/src/gen/todo/v1/todo_pb";

const transport = createGrpcWebTransport({
  baseUrl: "http://localhost:8080",
  useBinaryFormat: true,
});

const client = createClient(TodoService, transport);

// Define our own interface for the API responses
export interface SimpleTodo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export { CreateTodoRequest, UpdateTodoRequest };

export const todoApi = {
  async createTodo(data: CreateTodoRequest): Promise<SimpleTodo> {
    const response = await client.createTodo(data);
    const todo = ((response as unknown) as { todo: GeneratedTodo }).todo;
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt?.toDate().toISOString() || '',
      updatedAt: todo.updatedAt?.toDate().toISOString() || '',
    };
  },

  async getTodo(id: string): Promise<SimpleTodo> {
    const response = await client.getTodo({ id });
    const todo = ((response as unknown) as { todo: GeneratedTodo }).todo;
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt?.toDate().toISOString() || '',
      updatedAt: todo.updatedAt?.toDate().toISOString() || '',
    };
  },

  async listTodos(): Promise<SimpleTodo[]> {
    const response = await client.listTodos({
      pageSize: 100,
      pageToken: "",
    });
    const todos = ((response as unknown) as { todos: GeneratedTodo[] }).todos;
    return todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt?.toDate().toISOString() || '',
      updatedAt: todo.updatedAt?.toDate().toISOString() || '',
    }));
  },

  async updateTodo(id: string, data: UpdateTodoRequest): Promise<SimpleTodo> {
    const response = await client.updateTodo({
      ...data,
      id,
    });
    const todo = ((response as unknown) as { todo: GeneratedTodo }).todo;
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt?.toDate().toISOString() || '',
      updatedAt: todo.updatedAt?.toDate().toISOString() || '',
    };
  },

  async deleteTodo(id: string): Promise<void> {
    await client.deleteTodo({ id });
  }
}; 