<template>
  <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <input
          type="checkbox"
          :checked="task.status === 'concluida'"
          @change="toggleStatus"
          class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <h3 class="ml-3 text-lg font-semibold text-gray-800">
          {{ task.title }}
        </h3>
      </div>
      <div class="flex items-center gap-2">
        <span
          :class="{
            'bg-green-100 text-green-800': task.status === 'concluida',
            'bg-yellow-100 text-yellow-800': task.status === 'pendente'
          }"
          class="px-3 py-1 rounded-full text-sm font-medium"
        >
          {{ task.status }}
        </span>
        <button
          @click="editTask"
          class="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Editar tarefa"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="deleteTask"
          class="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          title="Excluir tarefa"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <div class="mb-4">
      <p class="text-gray-600 mb-2">{{ task.description }}</p>
      <p class="text-sm text-gray-500">
        <svg class="inline w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formatDate(task.dueDate) }} às {{ formatTime(task.dueTime) }}
      </p>
    </div>

    <div class="flex justify-end">
      <button
        @click="toggleStatus"
        :class="{
          'bg-green-500 hover:bg-green-600': task.status === 'pendente',
          'bg-yellow-500 hover:bg-yellow-600': task.status === 'concluida'
        }"
        class="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ task.status === 'concluida' ? 'Reabrir' : 'Concluir' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Task } from '@/types/task'

const formatDate = (date: string): string => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatTime = (time: string): string => {
  if (!time) return ''
  const t = time.split(':')
  return `${t[0]}:${t[1]}`
}

export default defineComponent({
  name: 'TaskItem',
  props: {
    task: {
      type: Object as () => Task,
      required: true
    }
  },
  emits: ['update-task', 'delete-task', 'edit-task'],
  setup(props, { emit }) {
    const toggleStatus = () => {
      const updatedTask = { ...props.task }
      updatedTask.status = updatedTask.status === 'concluida' ? 'pendente' : 'concluida'
      emit('update-task', updatedTask)
    }

    const editTask = () => {
      emit('edit-task', props.task)
    }

    const deleteTask = () => {
      emit('delete-task', props.task.id)
    }

    return {
      formatDate,
      formatTime,
      toggleStatus,
      editTask,
      deleteTask
    }
  }
})
</script>
