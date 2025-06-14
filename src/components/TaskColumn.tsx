import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { TaskColumnProps } from '../types';

const TaskColumn: React.FC<TaskColumnProps> = ({ column, tasks }) => {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: column.id,
  });

  const columnTasks = tasks.filter(task => column.taskIds.includes(task.id))
    .sort((a, b) => column.taskIds.indexOf(a.id) - column.taskIds.indexOf(b.id));

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="task-column p-3 h-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">{column.title}</h5>
          <span className="badge bg-secondary">{columnTasks.length}</span>
        </div>

        <div
          ref={setNodeRef}
          className={`droppable-area ${isOver ? 'drag-over' : ''}`}
          style={{ minHeight: '400px' }}
        >
          <SortableContext
            items={columnTasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {columnTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>

          {columnTasks.length === 0 && (
            <div className="text-center text-muted py-5">
              <p className="mb-0">No tasks in this column</p>
              <small>Drag tasks here or create new ones</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;