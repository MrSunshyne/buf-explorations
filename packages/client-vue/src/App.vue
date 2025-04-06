<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { client } from './client';
import { create } from "@bufbuild/protobuf";
import type { Todo } from "@buf-explorations/protos/gen/ts/v1/todo_pb";
import type { Any } from "@bufbuild/protobuf/wkt";
import { CreateTodoRequestSchema, UpdateTodoRequestSchema } from "@buf-explorations/protos/gen/ts/v1/todo_pb";
import TodoForm from './components/TodoForm.vue';
import TodoItem from './components/TodoItem.vue';

type TodoInput = Pick<Todo, "name" | "description"> & { metadata?: Any };

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
    const request = create(CreateTodoRequestSchema, {
      name: input.name,
      description: input.description,
      metadata: input.metadata
    });
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
/* Global styles */
:root {
  --stone-color: #5a5a5a;
  --stone-texture: #4a4a4a;
  --parchment-color: #f4e4bc;
  --ink-color: #2c1810;
  --shadow-color: rgba(0, 0, 0, 0.2);
  --page-width: 500px;
}

body {
  background: #2c2c2c;
  background-image: 
    radial-gradient(circle at center, #353535 0%, #2c2c2c 100%);
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
}

h1 {
  text-align: center;
  color: #d4af37;
  font-family: 'Palatino', serif;
  font-size: 2.5rem;
  text-shadow: 
    0 2px 4px rgba(0,0,0,0.3),
    0 8px 16px rgba(0,0,0,0.2);
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
  background: linear-gradient(90deg, transparent, #d4af37 20%, #d4af37 80%, transparent);
}

.book-layout {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex: 1;
  min-height: 0;
  margin: 0 2rem;
  position: relative;
}

/* Stone Tablet Styles */
.left-page {
  width: var(--page-width);
  background: var(--stone-color);
  position: relative;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 
    inset 0 2px 10px rgba(0,0,0,0.5),
    0 5px 15px rgba(0,0,0,0.5);
  overflow: hidden;
}

.left-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      45deg,
      var(--stone-texture),
      var(--stone-texture) 2px,
      transparent 2px,
      transparent 8px
    ),
    repeating-linear-gradient(
      -45deg,
      var(--stone-texture),
      var(--stone-texture) 2px,
      transparent 2px,
      transparent 8px
    );
  opacity: 0.1;
  pointer-events: none;
}

.left-page::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.1) 0%,
    transparent 50%,
    rgba(0,0,0,0.1) 100%
  );
  pointer-events: none;
}

/* Manuscript Styles */
.right-page {
  width: var(--page-width);
  background: var(--parchment-color);
  position: relative;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  box-shadow: 
    inset 0 0 10px rgba(0,0,0,0.2),
    0 5px 15px rgba(0,0,0,0.3);
  overflow: hidden;
  transform: rotate(0.5deg);
}

.right-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
    linear-gradient(
      to right,
      rgba(0,0,0,0.05) 0px,
      transparent 1px
    );
  background-size: 100px 100px, 10px 100%;
  opacity: 0.8;
  pointer-events: none;
}

.right-page::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    rgba(0,0,0,0.1) 0%,
    transparent 20%,
    transparent 80%,
    rgba(0,0,0,0.1) 100%
  );
  pointer-events: none;
}

.page-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.left-page .page-content {
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.1),
    transparent 10%,
    transparent 90%,
    rgba(0,0,0,0.1)
  );
  border-radius: 8px;
  padding: 1.5rem;
}

.right-page .page-content {
  background-image: 
    linear-gradient(#ad8b73 1px, transparent 1px);
  background-size: 100% 2rem;
  padding: 0 1rem;
  line-height: 2rem;
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
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
}

.todos-wrapper::-webkit-scrollbar-thumb {
  background: rgba(101,67,33,0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.todos-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(101,67,33,0.5);
}

h2 {
  color: rgba(255,255,255,0.9);
  font-family: 'Palatino', serif;
  font-size: 1.75rem;
  margin: 0 0 1.5rem;
  text-align: center;
  position: relative;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.right-page h2 {
  color: var(--ink-color);
  text-shadow: none;
  font-style: italic;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.5) 70%, transparent);
}

.right-page h2::after {
  background: linear-gradient(90deg, transparent, var(--ink-color) 30%, var(--ink-color) 70%, transparent);
  opacity: 0.3;
}

.error-message {
  background: rgba(255,82,82,0.1);
  color: #ff5252;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255,82,82,0.2);
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.1),
    0 1px 2px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: system-ui, -apple-system, sans-serif;
}

.loading-message {
  text-align: center;
  color: rgba(255,255,255,0.6);
  padding: 2rem 0;
  font-style: italic;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}

[data-testid="empty-message"] {
  text-align: center;
  color: rgba(44,24,16,0.6);
  font-style: italic;
  padding: 2rem;
  margin: 1rem 0;
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
