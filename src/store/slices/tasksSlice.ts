import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Task, TasksState } from '../../types';

const loadTasksFromStorage = (): Task[] => {
  try {
    const serializedTasks = localStorage.getItem('trello-tasks');
    if (serializedTasks === null) {
      return [];
    }
    return JSON.parse(serializedTasks);
  } catch (err) {
    return [];
  }
};

const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    const serializedTasks = JSON.stringify(tasks);
    localStorage.setItem('trello-tasks', serializedTasks);
  } catch (err) {
    console.error('Could not save tasks to localStorage:', err);
  }
};

const initialState: TasksState = {
  tasks: loadTasksFromStorage(),
  columns: {
    'todo': { id: 'todo', title: 'To Do', taskIds: [] },
    'inprogress': { id: 'inprogress', title: 'In Progress', taskIds: [] },
    'done': { id: 'done', title: 'Done', taskIds: [] }
  }
};

// Initialize column task IDs based on task statuses
const initializeColumns = (state: TasksState): void => {
  state.columns.todo.taskIds = state.tasks.filter(task => task.status === 'todo').map(task => task.id);
  state.columns.inprogress.taskIds = state.tasks.filter(task => task.status === 'inprogress').map(task => task.id);
  state.columns.done.taskIds = state.tasks.filter(task => task.status === 'done').map(task => task.id);
};

// Initialize columns on load
initializeColumns(initialState);

interface AddTaskPayload {
  title: string;
  description: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  status?: 'todo' | 'inprogress' | 'done';
}

interface UpdateTaskPayload {
  id: string;
  updates: Partial<Task>;
}

interface MoveTaskPayload {
  taskId: string;
  sourceStatus: string;
  destinationStatus: 'todo' | 'inprogress' | 'done';
  sourceIndex: number;
  destinationIndex: number;
}

interface ReorderTasksPayload {
  columnId: string;
  sourceIndex: number;
  destinationIndex: number;
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<AddTaskPayload>) => {
      const newTask: Task = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description,
        dueDate: action.payload.dueDate,
        priority: action.payload.priority,
        status: action.payload.status || 'todo',
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      state.tasks.push(newTask);
      state.columns[newTask.status].taskIds.push(newTask.id);
      saveTasksToStorage(state.tasks);
    },
    
    updateTask: (state, action: PayloadAction<UpdateTaskPayload>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        const oldStatus = state.tasks[taskIndex].status;
        const newStatus = updates.status || oldStatus;
        
        // Update task data
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
        
        // If status changed, update columns
        if (newStatus !== oldStatus) {
          const oldColumn = state.columns[oldStatus];
          const newColumn = state.columns[newStatus];
          
          // Remove from old column
          oldColumn.taskIds = oldColumn.taskIds.filter(taskId => taskId !== id);
          // Add to new column
          newColumn.taskIds.push(id);
          
          // Update task status
          state.tasks[taskIndex].status = newStatus;
          
          // Set completion date if moved to done
          if (newStatus === 'done') {
            state.tasks[taskIndex].completedAt = new Date().toISOString();
          } else {
            state.tasks[taskIndex].completedAt = null;
          }
        }
        
        saveTasksToStorage(state.tasks);
      }
    },
    
    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        state.columns[task.status].taskIds = state.columns[task.status].taskIds.filter(id => id !== taskId);
        saveTasksToStorage(state.tasks);
      }
    },
    
    moveTask: (state, action: PayloadAction<MoveTaskPayload>) => {
      const { taskId, sourceStatus, destinationStatus, sourceIndex, destinationIndex } = action.payload;
      
      const sourceColumn = state.columns[sourceStatus as keyof typeof state.columns];
      const destinationColumn = state.columns[destinationStatus];
      
      // Remove from source
      sourceColumn.taskIds.splice(sourceIndex, 1);
      
      // Add to destination
      destinationColumn.taskIds.splice(destinationIndex, 0, taskId);
      
      // Update task status
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = destinationStatus;
        
        // Set completion date if moved to done
        if (destinationStatus === 'done') {
          state.tasks[taskIndex].completedAt = new Date().toISOString();
        } else {
          state.tasks[taskIndex].completedAt = null;
        }
      }
      
      saveTasksToStorage(state.tasks);
    },
    
    reorderTasks: (state, action: PayloadAction<ReorderTasksPayload>) => {
      const { columnId, sourceIndex, destinationIndex } = action.payload;
      const column = state.columns[columnId as keyof typeof state.columns];
      const [movedTaskId] = column.taskIds.splice(sourceIndex, 1);
      column.taskIds.splice(destinationIndex, 0, movedTaskId);
    }
  }
});

export const { addTask, updateTask, deleteTask, moveTask, reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer;