import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Moon, Sun } from 'lucide-react';
import { toggleTheme } from '../store/slices/themeSlice';
import TaskModal from './TaskModal';
import { RootState } from '../types';


const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.theme);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleThemeToggle = (): void => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark  mb-4">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            TrackWise
          </a>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn add-task-btn d-flex align-items-center"
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} className="me-1" />
              <span className="d-none d-sm-inline">Add Task</span>
            </button>

            <button
              className="btn btn-outline-light"
              onClick={handleThemeToggle}
              // title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}

            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          isEdit={false}
        />
      )}
    </>
  );
};

export default Header;