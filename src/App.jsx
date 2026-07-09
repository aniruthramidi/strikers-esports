import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import Teams from './pages/Teams';
import Services from './pages/Services';
import Merch from './pages/Merch';
import Calculator from './pages/Calculator';
import Admin from './pages/Admin';
import Intro from './components/Intro';

function App() {
  return (
    <AdminProvider>
      <Intro />
      <Router>
        <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/team" element={<Teams />} />
              <Route path="/services" element={<Services />} />
              <Route path="/merch" element={<Merch />} />
              <Route path="/bgis-calculator" element={<Calculator />} />
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
