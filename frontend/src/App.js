import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Category from './components/Categories';
import BudgetManagement from './components/Budget';
import Register from './components/Signin';
import Login from './components/Login';  
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
<Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />


        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="/category" element={<PrivateRoute><Category /></PrivateRoute>} />
        <Route path="/budget" element={<PrivateRoute><BudgetManagement /></PrivateRoute>} />

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
