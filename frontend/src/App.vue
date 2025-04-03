<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { todoApi } from './api';
import type { GeneratedTodo, CreateTodoRequest } from './api';

const todos = ref<GeneratedTodo[]>([]);
const newTodoTitle = ref('');
const newTodoDescription = ref('');
const editingTodoId = ref<string | null>(null);
const editTitle = ref('');
const editDescription = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchTodos = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    todos.value = await todoApi.listTodos();
  } catch (err) {
    console.error("Failed to fetch todos:", err);
    error.value = 'Failed to load todos. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const addTodo = async () => {
  if (!newTodoTitle.value.trim()) return;
  isLoading.value = true;
  error.value = null;
  const newTodoData: CreateTodoRequest = {
    title: newTodoTitle.value,
    description: newTodoDescription.value,
  };
  try {
    const createdTodo = await todoApi.createTodo(newTodoData);
    todos.value.push(createdTodo);
    newTodoTitle.value = '';
    newTodoDescription.value = '';
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
    await todoApi.deleteTodo(id);
    todos.value = todos.value.filter(todo => todo.id !== id);
  } catch (err) {
    console.error("Failed to delete todo:", err);
    error.value = 'Failed to delete todo.';
  } finally {
    isLoading.value = false;
  }
};

const startEditing = (todo: GeneratedTodo) => {
  editingTodoId.value = todo.id;
  editTitle.value = todo.title;
  editDescription.value = todo.description;
};

const cancelEditing = () => {
  editingTodoId.value = null;
  editTitle.value = '';
  editDescription.value = '';
};

const updateTodo = async (id: string) => {
  if (!editTitle.value.trim()) return; // Prevent saving empty title
  isLoading.value = true;
  error.value = null;
  try {
    const updatedTodo = await todoApi.updateTodo(id, {
      title: editTitle.value,
      description: editDescription.value,
      // Retain original completed status when updating title/desc only
      // To update 'completed', we'd need a separate mechanism (e.g., toggleTodo)
    });
    const index = todos.value.findIndex(t => t.id === id);
    if (index !== -1) {
      todos.value[index] = updatedTodo;
    }
    cancelEditing(); // Exit edit mode
  } catch (err) {
    console.error("Failed to update todo:", err);
    error.value = 'Failed to update todo.';
  } finally {
    isLoading.value = false;
  }
};

const toggleTodo = async (todo: GeneratedTodo) => {
  isLoading.value = true;
  error.value = null;
  try {
    const updatedTodo = await todoApi.updateTodo(todo.id, { completed: !todo.completed });
    const index = todos.value.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      todos.value[index] = updatedTodo;
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
  <div class="todo-app">
    <h1>Todo List</h1>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <form @submit.prevent="addTodo" class="add-todo-form">
      <input type="text" v-model="newTodoTitle" placeholder="Todo title" required />
      <input type="text" v-model="newTodoDescription" placeholder="Description (optional)" />
      <button type="submit" :disabled="isLoading">Add Todo</button>
    </form>

    <div v-if="isLoading && !todos.length" class="loading-message">Loading todos...</div>

    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.completed }">
        <div v-if="editingTodoId === todo.id" class="edit-form">
          <input type="text" v-model="editTitle" required />
          <input type="text" v-model="editDescription" />
          <button @click="updateTodo(todo.id)" :disabled="isLoading">Save</button>
          <button @click="cancelEditing" :disabled="isLoading">Cancel</button>
        </div>
        <div v-else class="view-mode">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo)"
            :disabled="isLoading"
          />
          <span class="todo-title">{{ todo.title }}</span>
          <span class="todo-description" v-if="todo.description"> - {{ todo.description }}</span>
          <div class="actions">
             <button @click="startEditing(todo)" :disabled="isLoading">Edit</button>
             <button @click="deleteTodo(todo.id)" :disabled="isLoading">Delete</button>
          </div>
        </div>
      </li>
    </ul>

    <p v-if="!isLoading && !todos.length">No todos yet!</p>

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

.add-todo-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-todo-form input[type="text"] {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-todo-form button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-todo-form button:hover {
  background-color: #45a049;
}

.add-todo-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.todo-list li:last-child {
  border-bottom: none;
}

.todo-list li.completed {
  background-color: #f5f5f5;
}

.todo-list li.completed .todo-title,
.todo-list li.completed .todo-description {
  text-decoration: line-through;
  color: #999;
}

.todo-list .view-mode {
  display: flex;
  align-items: center;
  width: 100%;
}

.todo-list input[type="checkbox"] {
  margin-right: 0.75rem;
  cursor: pointer;
}

.todo-title {
  font-weight: bold;
  flex-grow: 1;
  margin-right: 0.5rem;
}

.todo-description {
  color: #666;
  font-size: 0.9em;
  flex-grow: 2; /* Give description more space */
  margin-right: 1rem;
}

.todo-list .actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto; /* Push actions to the right */
}

.todo-list .actions button {
  padding: 0.25rem 0.5rem;
  font-size: 0.8em;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  transition: background-color 0.2s, border-color 0.2s;
}

.todo-list .actions button:hover {
  background-color: #f0f0f0;
  border-color: #bbb;
}

.todo-list .actions button:disabled {
  background-color: #eee;
  color: #aaa;
  border-color: #ddd;
  cursor: not-allowed;
}

.todo-list .edit-form {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.edit-form input[type="text"] {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-form button {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  border: none;
}

.edit-form button:first-of-type { /* Save button */
  background-color: #2196F3;
  color: white;
}

.edit-form button:first-of-type:hover {
  background-color: #1e88e5;
}

.edit-form button:last-of-type { /* Cancel button */
  background-color: #f44336;
  color: white;
}

.edit-form button:last-of-type:hover {
  background-color: #e53935;
}

.edit-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

</style>
