import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

const App: React.FC = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      {/* Footer can go here */}
    </div>
  );
};

export default App;
