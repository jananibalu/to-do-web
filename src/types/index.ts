export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inprogress' | 'done';
  createdAt: string;
  completedAt: string | null;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface TasksState {
  tasks: Task[];
  columns: {
    todo: Column;
    inprogress: Column;
    done: Column;
  };
}

export interface FiltersState {
  activeFilter: 'all' | 'completed' | 'pending';
  searchTerm: string;
}

export interface ThemeState {
  theme: 'light' | 'dark';
}

export interface RootState {
  tasks: TasksState;
  filters: FiltersState;
  theme: ThemeState;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inprogress' | 'done';
}

export interface TaskModalProps {
  task?: Task | null;
  onClose: () => void;
  isEdit?: boolean;
}

export interface TaskCardProps {
  task: Task;
}

export interface TaskColumnProps {
  column: Column;
  tasks: Task[];
}

export type DueDateStatus = 'overdue' | 'due-soon' | 'normal' | null;