import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CoffeeProvider } from './context/CoffeeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Features from './sections/Features';
import Menu from './sections/Menu';
import Mixology from './sections/Mixology';
import About from './sections/About';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ReservationForm from './pages/ReservationForm';
import ProtectedRoute from './components/ProtectedRoute';

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Menu />
        <Mixology />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CoffeeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reserve" element={<ReservationForm />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CoffeeProvider>
    </AuthProvider>
  );
}

export default App;
