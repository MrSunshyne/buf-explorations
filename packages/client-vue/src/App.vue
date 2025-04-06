<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { client } from './client';
import { create } from "@bufbuild/protobuf";
import type { Todo } from "@buf-explorations/protos/gen/ts/v1/todo_pb";
import { CreateTodoRequestSchema, UpdateTodoRequestSchema } from "@buf-explorations/protos/gen/ts/v1/todo_pb";
import TodoForm from './components/TodoForm.vue';
import TodoItem from './components/TodoItem.vue';

type TodoInput = Pick<Todo, "name" | "description">;

const todos = ref<Todo[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchTodos = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await client.listTodos({
      pageSize: 100,
      pageToken: "",
    });
    todos.value = response.todos;
  } catch (err) {
    console.error("Failed to fetch todos:", err);
    error.value = 'Failed to load todos. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const addTodo = async (input: TodoInput) => {
  isLoading.value = true;
  error.value = null;
  try {
    const request = create(CreateTodoRequestSchema, input);
    const response = await client.createTodo(request);
    if (!response.todo) {
      throw new Error("createTodo response did not contain a todo object.");
    }
    todos.value.push(response.todo);
  } catch (err) {
    console.error("Failed to add todo:", err);
    error.value = 'Failed to add todo.';
  } finally {
    isLoading.value = false;
  }
};

const deleteTodo = async (id: string) => {
  isLoading.value = true;
  error.value = null;
  try {
    await client.deleteTodo({ id });
    todos.value = todos.value.filter(todo => todo.id !== id);
  } catch (err) {
    console.error("Failed to delete todo:", err);
    error.value = 'Failed to delete todo.';
  } finally {
    isLoading.value = false;
  }
};

const updateTodo = async (id: string, updates: { name: string; description: string }) => {
  isLoading.value = true;
  error.value = null;
  try {
    const currentTodo = todos.value.find(t => t.id === id);
    if (!currentTodo) throw new Error('Todo not found');

    const request = create(UpdateTodoRequestSchema, {
      id,
      name: updates.name,
      description: updates.description,
      completed: currentTodo.completed
    });
    const response = await client.updateTodo(request);
    if (!response.todo) {
      throw new Error("updateTodo response did not contain a todo object.");
    }
    const index = todos.value.findIndex(t => t.id === id);
    if (index !== -1) {
      todos.value[index] = response.todo;
    }
  } catch (err) {
    console.error("Failed to update todo:", err);
    error.value = 'Failed to update todo.';
  } finally {
    isLoading.value = false;
  }
};

const toggleTodo = async (todo: Todo) => {
  isLoading.value = true;
  error.value = null;
  try {
    const request = create(UpdateTodoRequestSchema, {
      id: todo.id,
      name: todo.name,
      description: todo.description,
      completed: !todo.completed
    });
    const response = await client.updateTodo(request);
    if (!response.todo) {
      throw new Error("updateTodo response did not contain a todo object.");
    }
    const index = todos.value.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      todos.value[index] = response.todo;
    }
  } catch (err) {
    console.error("Failed to toggle todo:", err);
    error.value = 'Failed to toggle todo status.';
  } finally {
    isLoading.value = false;
  }
};

// Fetch todos when the component mounts
onMounted(fetchTodos);
</script>

<template>
  <div class="todo-app" data-testid="todo-app">
    <h1>Todo List</h1>

    <div v-if="error" class="error-message" data-testid="error-message">
      {{ error }}
    </div>

    <TodoForm
      :is-loading="isLoading"
      @submit="addTodo"
    />

    <div v-if="isLoading && !todos.length" class="loading-message" data-testid="loading-message">
      Loading todos...
    </div>

    <ul class="todo-list" data-testid="todo-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :is-loading="isLoading"
        @update="updateTodo"
        @delete="deleteTodo"
        @toggle="toggleTodo"
      />
    </ul>

    <p v-if="!isLoading && !todos.length" data-testid="empty-message">
      No todos yet!
    </p>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.5rem 1rem;
  border: 1px solid #ef9a9a;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}

.loading-message {
  text-align: center;
  color: #666;
  margin: 2rem 0;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
