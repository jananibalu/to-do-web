import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Clock, Edit, Trash2, AlertCircle, ArrowRight } from 'lucide-react';
import { updateTask, deleteTask } from '../store/slices/tasksSlice';
import TaskModal from './TaskModal';
import { TaskCardProps, DueDateStatus, Task } from '../types';

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState<boolean>(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleStatusChange = (e: React.MouseEvent<HTMLButtonElement>, newStatus: Task['status']): void => {
    e.stopPropagation();
    dispatch(updateTask({ 
      id: task.id, 
      updates: { status: newStatus }
    }));
  };

  const getNextStatus = (): Task['status'] => {
    switch (task.status) {
      case 'todo':
        return 'inprogress';
      case 'inprogress':
        return 'done';
      case 'done':
        return 'todo';
      default:
        return 'todo';
    }
  };

  const getStatusButtonText = (): string => {
    switch (task.status) {
      case 'todo':
        return 'Start Task';
      case 'inprogress':
        return 'Complete';
      case 'done':
        return 'Reopen';
      default:
        return 'Update';
    }
  };

  const getStatusButtonClass = (): string => {
    switch (task.status) {
      case 'todo':
        return 'btn-outline-primary';
      case 'inprogress':
        return 'btn-outline-success';
      case 'done':
        return 'btn-outline-warning';
      default:
        return 'btn-outline-secondary';
    }
  };

  const getDueDateStatus = (): DueDateStatus => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 1) return 'due-soon';
    return 'normal';
  };

  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`card task-card mb-3 priority-${task.priority} fade-in`}
      >
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="card-title mb-1 fw-semibold">{task.title}</h6>
            <div className="d-flex gap-1">
              <button
                className="btn btn-outline-primary btn-sm p-1"
                onClick={handleEdit}
                title="Edit task"
              >
                <Edit size={14} />
              </button>
              <button
                className="btn btn-outline-danger btn-sm p-1"
                onClick={handleDelete}
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className="card-text small text-muted mb-2" style={{ fontSize: '0.85rem' }}>
              {task.description.length > 100 
                ? `${task.description.substring(0, 100)}...` 
                : task.description}
            </p>
          )}
          
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className={`badge priority-badge priority-${task.priority} text-uppercase`} style={{ fontSize: '0.7rem' }}>
              {task.priority}
            </span>
            
            {task.dueDate && (
              <div className={`d-flex align-items-center small ${
                dueDateStatus === 'overdue' ? 'text-danger' : 
                dueDateStatus === 'due-soon' ? 'due-date-warning' : 'text-muted'
              }`}>
                {dueDateStatus === 'overdue' && <AlertCircle size={12} className="me-1" />}
                <Calendar size={12} className="me-1" />
                <span style={{ fontSize: '0.75rem' }}>{formatDueDate(task.dueDate)}</span>
              </div>
            )}
          </div>

          {/* Status Update Button */}
          <div className="mb-2">
            <button
              className={`btn btn-sm ${getStatusButtonClass()} w-100 d-flex align-items-center justify-content-center`}
              onClick={(e) => handleStatusChange(e, getNextStatus())}
              title={`Move to ${getNextStatus().replace('inprogress', 'In Progress')}`}
            >
              <ArrowRight size={14} className="me-1" />
              {getStatusButtonText()}
            </button>
          </div>

          {/* Quick Status Selector */}
          <div className="btn-group w-100 mb-2" role="group">
            <button
              type="button"
              className={`btn btn-sm ${task.status === 'todo' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={(e) => handleStatusChange(e, 'todo')}
              title="Move to To Do"
            >
              To Do
            </button>
            <button
              type="button"
              className={`btn btn-sm ${task.status === 'inprogress' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={(e) => handleStatusChange(e, 'inprogress')}
              title="Move to In Progress"
            >
              In Progress
            </button>
            <button
              type="button"
              className={`btn btn-sm ${task.status === 'done' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={(e) => handleStatusChange(e, 'done')}
              title="Move to Done"
            >
              Done
            </button>
          </div>
          
          <div className="d-flex align-items-center justify-content-between">
            <small className="text-muted d-flex align-items-center">
              <Clock size={12} className="me-1" />
              Created {new Date(task.createdAt).toLocaleDateString()}
            </small>
            {task.completedAt && (
              <small className="text-success">
                ✓ Completed {new Date(task.completedAt).toLocaleDateString()}
              </small>
            )}
          </div>
        </div>
      </div>
      
      {showModal && (
        <TaskModal
          task={task}
          onClose={() => setShowModal(false)}
          isEdit={true}
        />
      )}
    </>
  );
};

export default TaskCard;