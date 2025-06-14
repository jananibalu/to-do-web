import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveFilter, setSearchTerm } from '../store/slices/filtersSlice';
import { Search, Filter } from 'lucide-react';
import { RootState } from '../types';

const TaskFilters: React.FC = () => {

  const dispatch = useDispatch();
  const { activeFilter, searchTerm } = useSelector((state: RootState) => state.filters);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { theme } = useSelector((state: RootState) => state.theme);


  const handleFilterChange = (filter: 'all' | 'completed' | 'pending'): void => {
    dispatch(setActiveFilter(filter));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(setSearchTerm(e.target.value));
  };

  const getTaskCounts = () => {
    const completed = tasks.filter(task => task.status === 'done').length;
    const pending = tasks.filter(task => task.status !== 'done').length;
    const total = tasks.length;
    return { completed, pending, total };
  };


  const { completed, pending, total } = getTaskCounts();

  const textClass = theme === 'dark' ? 'text-light' : 'text-dark';

  return (
    <div className="row mb-4">
      <div className="col-lg-8 col-md-7 mb-3 mb-md-0">
        <div className="d-flex align-items-center">
          <Filter size={20} className="me-2 text-muted" />
          <ul className="nav nav-pills filter-tabs mb-0">
            <li className="nav-item">
              <button

                className={`nav-link ${textClass} ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All Tasks <span className="badge bg-light text-dark ms-1">{total}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${textClass} ${activeFilter === 'pending' ? 'active' : ''}`}
                onClick={() => handleFilterChange('pending')}>
                Pending <span className="badge bg-light text-dark ms-1">{pending}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${textClass} ${activeFilter === 'completed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('completed')}
              >
                Completed <span className="badge bg-light text-dark ms-1">{completed}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="col-lg-4 col-md-5">
        <div className="input-group">
          <span className="input-group-text">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange} />
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
