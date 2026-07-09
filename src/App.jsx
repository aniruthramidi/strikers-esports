import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './features/admin/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './features/home/Home';
import Teams from './features/teams/Teams';
import Merch from './features/merch/Merch';
import Admin from './features/admin/Admin';
import About from './features/about/About';

function App() {
  return (
    <AdminProvider>
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
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
