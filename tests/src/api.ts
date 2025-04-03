import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/v1';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const todoApi = {
  async createTodo(data: CreateTodoRequest): Promise<Todo> {
    const response = await axios.post(`${API_BASE_URL}/todos`, data);
    return response.data.todo;
  },

  async getTodo(id: string): Promise<Todo> {
    const response = await axios.get(`${API_BASE_URL}/todos/${id}`);
    return response.data.todo;
  },

  async listTodos(): Promise<Todo[]> {
    const response = await axios.get(`${API_BASE_URL}/todos`);
    return response.data.todos;
  },

  async updateTodo(id: string, data: UpdateTodoRequest): Promise<Todo> {
    const response = await axios.patch(`${API_BASE_URL}/todos/${id}`, data);
    return response.data.todo;
  },

  async deleteTodo(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
  }
}; 