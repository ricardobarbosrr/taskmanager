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
import { taskStorage } from './services/taskStorage'

export default defineComponent({
  name: 'App',
  components: {
    TaskForm,
    TaskList
  },
  setup() {
    const tasks = ref<Task[]>([])
    const editingTask = ref<Task | null>(null)

    // Carregar tarefas ao iniciar
    onMounted(async () => {
      const savedTasks = await taskStorage.loadTasks()
      tasks.value = savedTasks
    })

    const startEditTask = (task: Task) => {
      editingTask.value = { ...task }
    }

    const addTask = async (newTask: Task) => {
      tasks.value.push(newTask)
      await saveTasks()
    }

    const editTask = async (updatedTask: Task) => {
      const index = tasks.value.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
        await saveTasks()
      }
      editingTask.value = null
    }

    const updateTask = async (updatedTask: Task) => {
      const index = tasks.value.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
        await saveTasks()
      }
    }

    const deleteTask = async (taskId: number) => {
      tasks.value = tasks.value.filter(task => task.id !== taskId)
      await saveTasks()
    }

    const saveTasks = async () => {
      try {
        await taskStorage.saveTasks(tasks.value)
      } catch (error) {
        console.error('Erro ao salvar tarefas:', error)
      }
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
