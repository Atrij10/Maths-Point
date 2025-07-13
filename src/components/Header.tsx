import React, { useState } from 'react';
import { Menu, X, LogIn, Shield, GraduationCap } from 'lucide-react';
import Logo from './Logo';
import Login from './Login';
import AdminPortal from './AdminPortal';
import StudentPortal from './StudentPortal';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isStudentPortalOpen, setIsStudentPortalOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'programs', label: 'Programs' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavigation = (sectionId: string) => {
    onNavigate(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Institution Name */}
            <div className="flex items-center space-x-2 sm:space-x-4 cursor-pointer group min-w-0 flex-1" onClick={() => handleNavigation('home')}>
              <Logo className="h-8 w-8 sm:h-10 sm:w-10 transition-transform duration-200 group-hover:scale-105 flex-shrink-0" />
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200 leading-tight">
                    Maths Point
                  </h1>
                  <p className="text-xs text-gray-600 leading-tight whitespace-nowrap">Educational Centre</p>
                </div>
                <div className="h-6 sm:h-8 w-px bg-blue-300 flex-shrink-0"></div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 tracking-wider whitespace-nowrap">
                  ARNAB MUKHERJEE
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Portal Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsStudentPortalOpen(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg text-sm"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Student</span>
                </button>
                
                <button
                  onClick={() => setIsAdminPortalOpen(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg text-sm"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center flex-shrink-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Fixed Height and Scrollable */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
                <nav className="flex flex-col py-4">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`px-4 py-3 text-left text-base font-medium transition-colors duration-200 ${
                        activeSection === item.id
                          ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  
                  {/* Mobile Portal Buttons */}
                  <div className="flex flex-col space-y-3 mt-4 px-4 pb-4">
                    <button
                      onClick={() => {
                        setIsStudentPortalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      <GraduationCap className="h-5 w-5" />
                      <span>Student Portal</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsAdminPortalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium text-base hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                    >
                      <Shield className="h-5 w-5" />
                      <span>Admin Portal</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AdminPortal isOpen={isAdminPortalOpen} onClose={() => setIsAdminPortalOpen(false)} />
      <StudentPortal isOpen={isStudentPortalOpen} onClose={() => setIsStudentPortalOpen(false)} />
    </>
  );
};

export default Header;