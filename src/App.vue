<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Gerenciador de Tarefas</h1>
        <p class="text-gray-600">Organize suas tarefas de forma simples e eficiente</p>
      </header>

      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <TaskForm 
          @add-task="addTask" 
          @edit-task="editTask"
          :editing-task="editingTask"
        />
      </div>

      <div class="bg-white rounded-xl shadow-lg p-8">
        <TaskList
          :tasks="tasks"
          @update-task="updateTask"
          @delete-task="deleteTask"
          @edit-task="startEditTask"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'
import { Task } from './types/task'

export default defineComponent({
  name: 'App',
  components: {
    TaskForm,
    TaskList
  },
  setup() {
    const tasks = ref<Task[]>([])
    const editingTask = ref<Task | null>(null)

    // Carregar tarefas do localStorage ao iniciar
    onMounted(() => {
      const savedTasks = localStorage.getItem('tasks')
      if (savedTasks) {
        tasks.value = JSON.parse(savedTasks)
      }
    })

    const startEditTask = (task: Task) => {
      editingTask.value = { ...task }
    }

    const addTask = (newTask: Task) => {
      tasks.value.push(newTask)
      saveTasks()
    }

    const editTask = (updatedTask: Task) => {
      const index = tasks.value.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
        saveTasks()
      }
      editingTask.value = null
    }

    const updateTask = (updatedTask: Task) => {
      const index = tasks.value.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
        saveTasks()
      }
    }

    const deleteTask = (taskId: number) => {
      tasks.value = tasks.value.filter(task => task.id !== taskId)
      saveTasks()
    }

    const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks.value))
    }

    return {
      tasks,
      addTask,
      updateTask,
      deleteTask,
      editingTask,
      editTask,
      startEditTask
    }
  }
})
</script>
