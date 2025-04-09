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

    // Carregar tarefas do servidor ao iniciar
    onMounted(async () => {
      try {
        const savedTasks = await taskStorage.loadTasks()
        tasks.value = savedTasks
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error)
      }
    })

    const startEditTask = (task: Task) => {
      editingTask.value = { ...task }
    }

    const addTask = async (newTask: Task) => {
      try {
        // Primeiro salvar a tarefa no servidor
        await taskStorage.saveTask(newTask)
        
        // Depois atualizar o estado local
        const allTasks = await taskStorage.loadTasks()
        tasks.value = allTasks
      } catch (error) {
        console.error('Erro ao adicionar tarefa:', error)
        throw error
      }
    }

    const editTask = async (updatedTask: Task) => {
      try {
        // Primeiro atualizar o estado local
        const index = tasks.value.findIndex(task => task.id === updatedTask.id)
        if (index !== -1) {
          tasks.value[index] = updatedTask
        }
        
        // Depois salvar no servidor
        await taskStorage.saveTask(updatedTask)
        
        // Recarregar as tarefas do servidor
        tasks.value = await taskStorage.loadTasks()
        
        // Limpar o estado de edição
        editingTask.value = null
      } catch (error) {
        console.error('Erro ao editar tarefa:', error)
        // Se houver erro, restaurar o estado anterior
        tasks.value = await taskStorage.loadTasks()
        throw error
      }
    }

    const updateTask = (updatedTask: Task) => {
      const index = tasks.value.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
        saveTasks()
      }
    }

    const saveTasks = async () => {
      try {
        // Se estamos editando, atualizar a tarefa específica
        if (editingTask.value) {
          await taskStorage.saveTask(editingTask.value)
          editingTask.value = null
        } else {
          // Se não estamos editando, adicionar a nova tarefa
          const newTask = tasks.value[tasks.value.length - 1]
          await taskStorage.saveTask(newTask)
        }
        
        // Recarregar as tarefas do servidor
        tasks.value = await taskStorage.loadTasks()
      } catch (error) {
        console.error('Erro ao salvar tarefas:', error)
        throw error
      }
    }

    const deleteTask = async (taskId: number) => {
      try {
        // Primeiro salvar a exclusão no servidor
        await taskStorage.deleteTask(taskId)
        
        // Depois atualizar o estado local
        tasks.value = await taskStorage.loadTasks()
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error)
        throw error
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
