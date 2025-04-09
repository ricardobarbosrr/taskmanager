<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Filtros</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filter.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @change="applyFilter"
          >
            <option value="all">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="concluida">Concluídas</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="filter.search"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @input="applyFilter"
            placeholder="Pesquisar tarefas..."
          />
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div v-if="filteredTasks.length === 0" class="text-center py-8 text-gray-500">
        <p>Nenhuma tarefa encontrada</p>
        <p class="text-sm text-gray-400">Adicione uma nova tarefa ou ajuste os filtros</p>
      </div>
      
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @update-task="updateTask"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { Task, TaskFilter } from '@/types/task'
import TaskItem from './TaskItem.vue'

export default defineComponent({
  name: 'TaskList',
  components: {
    TaskItem
  },
  props: {
    tasks: {
      type: Array as () => Task[],
      required: true
    }
  },
  emits: ['update-task'],
  setup(props, { emit }) {
    const filter = ref<TaskFilter>({
      status: 'all',
      search: ''
    })

    const filteredTasks = computed(() => {
      let filtered = [...props.tasks]

      if (filter.value.status !== 'all') {
        filtered = filtered.filter(
          task => task.status === filter.value.status
        )
      }

      if (filter.value.search) {
        const search = filter.value.search.toLowerCase()
        filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
        )
      }

      return filtered
    })

    const applyFilter = () => {
      // Nenhuma ação necessária, o computed já atualiza automaticamente
    }

    const updateTask = (updatedTask: Task) => {
      emit('update-task', updatedTask)
    }

    return {
      filter,
      filteredTasks,
      applyFilter,
      updateTask
    }
  }
})
</script>
