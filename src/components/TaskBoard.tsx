import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import { moveTask, reorderTasks } from '../store/slices/tasksSlice';
import { RootState, Task } from '../types';

const TaskBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, columns } = useSelector((state: RootState) => state.tasks);
  const { activeFilter, searchTerm } = useSelector((state: RootState) => state.filters);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = useMemo((): Task[] => {
    let filtered = [...tasks];

    // Apply status filter
    if (activeFilter === 'completed') {
      filtered = filtered.filter(task => task.status === 'done');
    } else if (activeFilter === 'pending') {
      filtered = filtered.filter(task => task.status !== 'done');
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tasks, activeFilter, searchTerm]);

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    const activeColumn = activeTask.status;

    // Determine if we're dropping over a column or a task
    let overColumn = overId;
    const overTask = tasks.find(task => task.id === overId);
    if (overTask) {
      overColumn = overTask.status;
    }

    // If dropping in the same column
    if (activeColumn === overColumn) {
      const columnTaskIds = columns[activeColumn as keyof typeof columns].taskIds;
      const activeIndex = columnTaskIds.indexOf(activeId);
      let overIndex = columnTaskIds.indexOf(overId);
      
      // If dropping over a column (not a task), place at the end
      if (overIndex === -1) {
        overIndex = columnTaskIds.length;
      }

      if (activeIndex !== overIndex) {
        dispatch(reorderTasks({
          columnId: activeColumn,
          sourceIndex: activeIndex,
          destinationIndex: overIndex
        }));
      }
    } else {
      // Moving between columns
      const sourceIndex = columns[activeColumn as keyof typeof columns].taskIds.indexOf(activeId);
      let destinationIndex = 0;
      
      if (overTask) {
        destinationIndex = columns[overColumn as keyof typeof columns].taskIds.indexOf(overId);
      } else {
        destinationIndex = columns[overColumn as keyof typeof columns].taskIds.length;
      }

      dispatch(moveTask({
        taskId: activeId,
        sourceStatus: activeColumn,
        destinationStatus: overColumn as 'todo' | 'inprogress' | 'done',
        sourceIndex,
        destinationIndex
      }));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="row">
        {Object.values(columns).map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={filteredTasks}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="drag-overlay">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;