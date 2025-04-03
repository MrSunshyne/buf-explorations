import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { todoApi, Todo } from './api';

describe('Todo Service CRUD Operations', () => {
  let createdTodo: Todo;

  beforeAll(async () => {
    // Create a test todo
    createdTodo = await todoApi.createTodo({
      title: 'Test Todo',
      description: 'This is a test todo'
    });
  });

  afterAll(async () => {
    // Clean up by deleting the test todo if it exists
    if (createdTodo?.id) {
      try {
        await todoApi.deleteTodo(createdTodo.id);
      } catch (error) {
        // Ignore errors if the todo was already deleted
      }
    }
  });

  it('should create a new todo', async () => {
    expect(createdTodo).toBeDefined();
    expect(createdTodo.title).toBe('Test Todo');
    expect(createdTodo.description).toBe('This is a test todo');
    expect(createdTodo.completed).toBe(false);
    expect(createdTodo.id).toBeDefined();
    expect(createdTodo.createdAt).toBeDefined();
    expect(createdTodo.updatedAt).toBeDefined();
  });

  it('should get a todo by id', async () => {
    const todo = await todoApi.getTodo(createdTodo.id);
    expect(todo).toBeDefined();
    expect(todo.id).toBe(createdTodo.id);
    expect(todo.title).toBe(createdTodo.title);
    expect(todo.description).toBe(createdTodo.description);
  });

  it('should list all todos', async () => {
    const todos = await todoApi.listTodos();
    expect(todos).toBeInstanceOf(Array);
    expect(todos.length).toBeGreaterThan(0);
    const foundTodo = todos.find(t => t.id === createdTodo.id);
    expect(foundTodo).toBeDefined();
  });

  it('should update a todo', async () => {
    const updatedTodo = await todoApi.updateTodo(createdTodo.id, {
      title: 'Updated Test Todo',
      description: 'This is an updated test todo',
      completed: true
    });

    expect(updatedTodo).toBeDefined();
    expect(updatedTodo.id).toBe(createdTodo.id);
    expect(updatedTodo.title).toBe('Updated Test Todo');
    expect(updatedTodo.description).toBe('This is an updated test todo');
    expect(updatedTodo.completed).toBe(true);
    expect(updatedTodo.updatedAt).not.toBe(createdTodo.updatedAt);
  });

  it('should delete a todo', async () => {
    await todoApi.deleteTodo(createdTodo.id);
    
    // Verify the todo is deleted by trying to get it
    try {
      await todoApi.getTodo(createdTodo.id);
      throw new Error('Todo should not exist');
    } catch (error) {
      // The server returns 500 when trying to get a deleted todo
      expect(error.response?.status).toBe(500);
    }
  });
}); 