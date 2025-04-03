import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { todoApi } from './api';
import { Code } from "@connectrpc/connect";
import { ConnectError } from '@connectrpc/connect';
import { CreateTodoRequest, UpdateTodoRequest } from "../../client/src/gen/todo/v1/todo_pb";

let createdTodos: string[] = [];

describe('Todo Service CRUD Operations', () => {
  beforeAll(async () => {
    // Initial cleanup (optional, good practice)
    try {
      const todos = await todoApi.listTodos();
      for (const todo of todos) {
        if (todo.title.startsWith('Test Todo')) {
          await todoApi.deleteTodo(todo.id);
        }
      }
    } catch (error) {
      console.error("Error during initial cleanup:", error);
    }
    createdTodos = []; // Reset the list
  });

  afterAll(async () => {
    // Cleanup todos created during the test run
    for (const id of createdTodos) {
      try {
        await todoApi.deleteTodo(id);
      } catch (error) {
        // Ignore errors if the todo was already deleted in a test
        if (!(error instanceof ConnectError && error.code === Code.NotFound)) {
           console.error(`Error cleaning up todo ${id}:`, error);
        }
      }
    }
  });

  it('should create a new todo', async () => {
    const createData = new CreateTodoRequest({
      title: 'Test Todo Create',
      description: 'Description for create test',
    });
    const todo = await todoApi.createTodo(createData);
    expect(todo.id).toBeDefined();
    expect(todo.title).toBe(createData.title);
    expect(todo.description).toBe(createData.description);
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
    createdTodos.push(todo.id); // Add to cleanup list
  });

  it('should get a todo by id', async () => {
    const createData = new CreateTodoRequest({
      title: 'Test Todo Get',
      description: 'Description for get test',
    });
    const createdTodo = await todoApi.createTodo(createData);
    createdTodos.push(createdTodo.id);

    const fetchedTodo = await todoApi.getTodo(createdTodo.id);
    expect(fetchedTodo).toEqual(createdTodo);
  });

  it('should list all todos', async () => {
    // Create a couple of todos to ensure the list is not empty
    const createData1 = new CreateTodoRequest({ title: 'Test Todo List 1', description: 'Desc 1' });
    const todo1 = await todoApi.createTodo(createData1);
    createdTodos.push(todo1.id);

    const createData2 = new CreateTodoRequest({ title: 'Test Todo List 2', description: 'Desc 2' });
    const todo2 = await todoApi.createTodo(createData2);
    createdTodos.push(todo2.id);

    const todos = await todoApi.listTodos();
    expect(todos.length).toBeGreaterThanOrEqual(2);
    // Check if our created todos are in the list
    expect(todos.some(t => t.id === todo1.id)).toBe(true);
    expect(todos.some(t => t.id === todo2.id)).toBe(true);
  });

  it('should update a todo', async () => {
    const createData = new CreateTodoRequest({
      title: 'Test Todo Update Original',
      description: 'Original Description',
    });
    const createdTodo = await todoApi.createTodo(createData);
    createdTodos.push(createdTodo.id);

    const updateData = new UpdateTodoRequest({
      id: createdTodo.id,
      title: 'Test Todo Update Updated',
      description: 'Updated Description',
      completed: true,
    });
    const updatedTodo = await todoApi.updateTodo(createdTodo.id, updateData);

    expect(updatedTodo.id).toBe(createdTodo.id);
    expect(updatedTodo.title).toBe(updateData.title);
    expect(updatedTodo.description).toBe(updateData.description);
    expect(updatedTodo.completed).toBe(updateData.completed);
    // Timestamps should ideally be different, but exact check is tricky
    expect(updatedTodo.updatedAt).not.toBe(createdTodo.updatedAt);
  });


  it('should delete a todo', async () => {
    // Create a todo to delete
    const createData = new CreateTodoRequest({
      title: 'Test Todo Delete',
      description: 'This todo will be deleted',
      // completed is not part of CreateTodoRequest
    });
    const createdTodo = await todoApi.createTodo(createData);
    expect(createdTodo.id).toBeDefined();
    // Don't add to createdTodos yet, as we expect to delete it

    // Delete the todo
    await todoApi.deleteTodo(createdTodo.id);

    // Try to get the deleted todo
    try {
      await todoApi.getTodo(createdTodo.id);
      // If getTodo doesn't throw, the test fails
      throw new Error('Expected getTodo to throw an error for deleted todo');
    } catch (error) {
      // The server should return a NotFound error code for a deleted todo
      expect(error instanceof ConnectError).toBe(true);
      if (error instanceof ConnectError) {
        expect(error.code).toBe(Code.NotFound);
      }
    }
  });
}); 