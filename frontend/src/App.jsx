import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import Report from './pages/Report';

// Um helper simples pra não deixar acessar sem estar logado
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/create-task" element={
          <PrivateRoute><TaskForm /></PrivateRoute>
        } />
        <Route path="/report" element={
          <PrivateRoute><Report /></PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
