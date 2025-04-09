<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold mb-6 text-gray-800">Adicionar Nova Tarefa</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          v-model="title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          :rules="[v => !!v || 'Título é obrigatório']"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          v-model="description"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          :rules="[v => !!v || 'Descrição é obrigatória']"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
        <input
          v-model="dueDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          :rules="[v => !!v || 'Data é obrigatória']"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Adicionar Tarefa
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Task } from '@/types/task'

export default defineComponent({
  name: 'TaskForm',
  emits: ['add-task'],
  setup(_, { emit }) {
    const title = ref('')
    const description = ref('')
    const dueDate = ref('')

    const handleSubmit = () => {
      if (title.value && description.value && dueDate.value) {
        const newTask: Task = {
          id: Date.now(),
          title: title.value,
          description: description.value,
          dueDate: dueDate.value,
          status: 'pendente',
          createdAt: new Date().toISOString()
        }

        emit('add-task', newTask)
        title.value = ''
        description.value = ''
        dueDate.value = ''
      }
    }

    return {
      title,
      description,
      dueDate,
      handleSubmit
    }
  }
})
</script>
