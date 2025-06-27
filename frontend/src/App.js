import React, { useContext } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/global.css';
import { AuthProvider, AuthContext } from './context/AuthContext';

function Layout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    // Only render the auth page, no header/footer
    return (
      <main>
        <AppRoutes />
      </main>
    );
  }

  // Render dashboard layout
  return (
    <>
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
}

const App = () => (
  <AuthProvider>
    <Router>
      <Layout />
    </Router>
  </AuthProvider>
);

export default App;
