import React from 'react';
import Sidebar from './Sidebar';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  return (
    <>
      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />
    </>
  );
};

export default Navbar;
