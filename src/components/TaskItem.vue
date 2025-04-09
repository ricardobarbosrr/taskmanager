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
      <span
        :class="{
          'bg-green-100 text-green-800': task.status === 'concluida',
          'bg-yellow-100 text-yellow-800': task.status === 'pendente'
        }"
        class="px-3 py-1 rounded-full text-sm font-medium"
      >
        {{ task.status }}
      </span>
    </div>

    <div class="mb-4">
      <p class="text-gray-600 mb-2">{{ task.description }}</p>
      <p class="text-sm text-gray-500">
        <svg class="inline w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formatDate(task.dueDate) }}
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

export default defineComponent({
  name: 'TaskItem',
  props: {
    task: {
      type: Object as () => Task,
      required: true
    }
  },
  emits: ['update-task'],
  setup(props, { emit }) {
    const formatDate = (date: string): string => {
      return new Date(date).toLocaleDateString('pt-BR')
    }

    const toggleStatus = () => {
      const updatedTask = { ...props.task }
      updatedTask.status = updatedTask.status === 'concluida' ? 'pendente' : 'concluida'
      emit('update-task', updatedTask)
    }

    return {
      formatDate,
      toggleStatus
    }
  }
})
</script>
