export interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: 'pendente' | 'concluida';
  createdAt: string;
}

export interface TaskFilter {
  status: 'all' | 'pendente' | 'concluida';
  search: string;
}
