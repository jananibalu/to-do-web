import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import TaskFilters from './components/TaskFilters';
import TaskBoard from './components/TaskBoard';
import { RootState } from './types';
import Footer from './components/Footer';

function App(): JSX.Element {
  const { theme } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <div className="min-vh-100">
      <Header />
      <div className="container-fluid px-4">
        <TaskFilters />
        <TaskBoard />
      </div>
      <Footer />
    </div>
  );
}

export default App;