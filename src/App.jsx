import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './features/admin/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './features/home/Home';
import Teams from './features/teams/Teams';
import Merch from './features/merch/Merch';
import Admin from './features/admin/Admin';
import About from './features/about/About';
import Intro3D from './components/Intro3D';
import SupportWidget from './components/SupportWidget';

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return localStorage.getItem('strikers_visited') !== 'true';
  });

  const handleIntroComplete = () => {
    localStorage.setItem('strikers_visited', 'true');
    setShowIntro(false);
  };

  return (
    <AdminProvider>
      {showIntro ? (
        <Intro3D onComplete={handleIntroComplete} />
      ) : (
        <Router>
          <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/team" element={<Teams />} />
                <Route path="/merch" element={<Merch />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Support Widget */}
            <SupportWidget />
          </div>
        </Router>
      )}
    </AdminProvider>
  );
}

export default App;
