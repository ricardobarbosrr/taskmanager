<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold mb-6 text-gray-800">{{ editingTask ? 'Editar Tarefa' : 'Adicionar Nova Tarefa' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          v-model="title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          v-model="description"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
        <input
          v-model="dueDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Hora de Vencimento</label>
        <input
          v-model="dueTime"
          type="time"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        {{ editingTask ? 'Salvar Edição' : 'Adicionar Tarefa' }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { Task } from '@/types/task'

export default defineComponent({
  name: 'TaskForm',
  props: {
    editingTask: {
      type: Object as () => Task | null,
      default: null
    }
  },
  emits: ['add-task', 'edit-task'],
  setup(props, { emit }) {
    const title = ref('')
    const description = ref('')
    const dueDate = ref('')
    const dueTime = ref('')

    // Atualizar campos quando a tarefa de edição mudar
    watch(() => props.editingTask, (newTask) => {
      if (newTask) {
        title.value = newTask.title
        description.value = newTask.description
        dueDate.value = newTask.dueDate
        dueTime.value = newTask.dueTime
      } else {
        title.value = ''
        description.value = ''
        dueDate.value = ''
        dueTime.value = ''
      }
    }, { immediate: true })

    const handleSubmit = () => {
      if (title.value && description.value && dueDate.value) {
        const taskData = {
          title: title.value,
          description: description.value,
          dueDate: dueDate.value,
          dueTime: dueTime.value,
          status: 'pendente'
        }

        if (props.editingTask) {
          const updatedTask = { ...props.editingTask, ...taskData }
          emit('edit-task', updatedTask)
        } else {
          const newTask: Task = {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString()
          }
          emit('add-task', newTask)
        }

        title.value = ''
        description.value = ''
        dueDate.value = ''
        dueTime.value = ''
      }
    }

    return {
      title,
      description,
      dueDate,
      dueTime,
      handleSubmit
    }
  }
})
</script>
