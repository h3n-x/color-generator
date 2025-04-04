import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColorProvider } from './context/ColorContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';

function App() {
  // Aplicar la clase retro-theme al body
  useEffect(() => {
    document.body.classList.add('retro-theme');
    
    // Limpiar al desmontar
    return () => {
      document.body.classList.remove('retro-theme');
    };
  }, []);

  return (
    <ColorProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="retro-card neon-border"
      />
    </ColorProvider>
  );
}

export default App
