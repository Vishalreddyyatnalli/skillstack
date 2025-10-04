import React from 'react';

interface HeaderProps {
  onOpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <button onClick={onOpenSidebar} className="lg:hidden">
        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center">
        
        <button onClick={() => window.location.pathname = '/add-skill'} className="btn btn-primary">Add New Skill</button>
      </div>
    </header>
  );
};

export default Header;