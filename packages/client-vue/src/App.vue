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

    <div class="book-layout">
      <div class="page left-page">
        <div class="page-content">
          <h2>Add New Todo</h2>
          <TodoForm
            :is-loading="isLoading"
            @submit="addTodo"
          />
        </div>
      </div>

      <div class="page right-page">
        <div class="page-content">
          <div v-if="error" class="error-message" data-testid="error-message">
            {{ error }}
          </div>

          <div v-if="isLoading && !todos.length" class="loading-message" data-testid="loading-message">
            Loading todos...
          </div>

          <div class="todos-wrapper">
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
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Global styles for skeuomorphic design */
:root {
  --paper-color: #ffffff;
  --ink-color: #2c3e50;
  --shadow-color: rgba(0, 0, 0, 0.2);
  --page-width: 500px;
  --margin-color: #c3d4e8;
}

body {
  background: #e6e6e6;
  background-image: 
    radial-gradient(circle at center, #f5f5f5 0%, #e6e6e6 100%);
  min-height: 100vh;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}
</style>

<style scoped>
.todo-app {
  max-width: calc(var(--page-width) * 2 + 4rem);
  margin: 0 auto;
  padding: 1.5rem 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15));
}

h1 {
  text-align: center;
  color: var(--ink-color);
  font-family: 'Palatino', serif;
  font-size: 2.5rem;
  text-shadow: 
    2px 2px 2px var(--shadow-color),
    0 8px 16px rgba(0,0,0,0.1);
  margin: 1rem 0 2rem;
  position: relative;
  letter-spacing: 0.05em;
}

h1::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--ink-color) 20%, var(--ink-color) 80%, transparent);
}

.book-layout {
  display: flex;
  gap: 0;
  justify-content: center;
  perspective: 2000px;
  flex: 1;
  min-height: 0;
  transform-style: preserve-3d;
  transform: rotateX(2deg);
  margin: 0 2rem;
}

.page {
  width: var(--page-width);
  background: var(--paper-color);
  position: relative;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
  overflow: hidden;
}

.page::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  z-index: 2;
}

.page::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, 
    rgba(255,255,255,0.1) 0%,
    transparent 10%,
    transparent 90%,
    rgba(0,0,0,0.05) 100%
  );
  pointer-events: none;
}

.left-page {
  border-radius: 12px 2px 2px 12px;
  box-shadow: 
    inset 15px 0 25px -15px rgba(0,0,0,0.2),
    inset -5px 0 10px -5px rgba(0,0,0,0.1),
    5px 0 15px -5px rgba(0,0,0,0.1);
  clip-path: inset(0px -15px 0px 0px);
}

.left-page::before {
  right: 0;
  background: linear-gradient(to right, transparent, rgba(0,0,0,0.1));
}

.right-page {
  border-radius: 2px 12px 12px 2px;
  box-shadow: 
    inset -15px 0 25px -15px rgba(0,0,0,0.2),
    inset 5px 0 10px -5px rgba(0,0,0,0.1),
    -5px 0 15px -5px rgba(0,0,0,0.1);
  clip-path: inset(0px 0px 0px -15px);
}

.right-page::before {
  left: 0;
  background: linear-gradient(to left, transparent, rgba(0,0,0,0.1));
}

.page-content {
  flex: 1;
  background-image: 
    linear-gradient(90deg, transparent 39px, var(--margin-color) 39px, var(--margin-color) 41px, transparent 41px),
    linear-gradient(var(--margin-color) 1px, transparent 1px);
  background-size: 100% 1.5em;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 8px;
  padding: 1.5rem 1.5rem 1.5rem calc(1.5rem + 40px);
  height: 100%;
  position: relative;
  background-color: rgba(255,255,255,0.5);
  backdrop-filter: blur(5px);
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.02),
    0 1px 2px rgba(255,255,255,0.5);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.right-page .page-content {
  display: flex;
  flex-direction: column;
}

.todos-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 0.75rem;
  margin-right: -0.25rem;
}

.todos-wrapper::-webkit-scrollbar {
  width: 6px;
}

.todos-wrapper::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.03);
  border-radius: 3px;
}

.todos-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.todos-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.2);
}

h2 {
  color: var(--ink-color);
  font-family: 'Palatino', serif;
  font-size: 1.75rem;
  margin: 0 0 1.5rem;
  text-align: center;
  position: relative;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
}

h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--ink-color) 30%, var(--ink-color) 70%, transparent);
}

.error-message {
  background: #fff0f0;
  color: #d32f2f;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255,82,82,0.2);
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.05),
    0 1px 2px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: system-ui, -apple-system, sans-serif;
  backdrop-filter: blur(5px);
}

.loading-message {
  text-align: center;
  color: #666;
  padding: 2rem 0;
  font-style: italic;
  text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

[data-testid="empty-message"] {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
  background: rgba(0,0,0,0.02);
  border-radius: 8px;
  margin: 1rem 0;
  text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
  border: 1px solid rgba(0,0,0,0.05);
  backdrop-filter: blur(5px);
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
