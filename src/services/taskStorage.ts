import { Task } from '../types/task'

const API_URL = 'http://localhost:3001/api/tasks'

export class TaskStorage {
  private static instance: TaskStorage
  private constructor() {}

  static getInstance(): TaskStorage {
    if (!TaskStorage.instance) {
      TaskStorage.instance = new TaskStorage()
    }
    return TaskStorage.instance
  }

  async loadTasks(): Promise<Task[]> {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Erro ao carregar tarefas')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
      return []
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await Promise.all(tasks.map(task => this.saveTask(task)))
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error)
      throw error
    }
  }

  async saveTask(task: Task): Promise<void> {
    try {
      const method = task.id ? 'PUT' : 'POST'
      const url = task.id ? `${API_URL}/${task.id}` : API_URL
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar tarefa')
      }
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error)
      throw error
    }
  }

  async deleteTask(taskId: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir tarefa')
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
      throw error
    }
  }
}

export const taskStorage = TaskStorage.getInstance()
