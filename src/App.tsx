import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Announcements from './components/Announcements';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
    
    if (sectionId === 'home') {
      // Scroll to top of page for home
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to specific section for other navigation items
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'programs', 'announcements', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeSection !== section) {
              setActiveSection(section);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Show admin panel with Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminPanel(!showAdminPanel);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAdminPanel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-blue-100">
      <Header activeSection={activeSection} onNavigate={handleNavigation} />
      <main>
        <Hero onNavigate={handleNavigation} />
        <About />
        <Programs onNavigate={handleNavigation} />
        <Announcements />
        <Contact />
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 text-white py-12 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Maths Point Educational Centre</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Empowering students to excel in mathematics through expert guidance and innovative teaching methods.
              </p>
              <div className="text-sm text-gray-300">
                <p>Since 1995 • 500+ Success Stories</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><button onClick={() => handleNavigation('about')} className="hover:text-blue-400 transition-colors">About</button></li>
                <li><button onClick={() => handleNavigation('programs')} className="hover:text-blue-400 transition-colors">Programs</button></li>
                <li><button onClick={() => handleNavigation('contact')} className="hover:text-blue-400 transition-colors">Contact</button></li>
                <li><button onClick={() => handleNavigation('announcements')} className="hover:text-blue-400 transition-colors">Announcements</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Classes 9 - 10</li>
                <li>Classes 11 - 12</li>
                <li>Competitive Exams</li>
                <li>Group Classes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>+91 98308 44440  |  +91 94330 44440</p>
                <p>maths-point.com</p>
                <p>arnab09@gmail.com</p>
                <p className="leading-relaxed">Room Number 72 1st Floor, EC Block, Salt Lake, Sector 1, Bidhannagar, Kolkata, West Bengal 700064</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © Maths Point Educational Centre. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Admin Panel - Hidden by default, show with Ctrl+Shift+A */}
      {showAdminPanel && <AdminPanel />}
    </div>
  );
}

export default App;