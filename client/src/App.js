import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import { ChatState } from './context/ChatProvider';

function App() {
  const {isLoggedIn} = ChatState();

  return (
    <Routes>
      <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login" />}/>
      <Route path='/login' element={!isLoggedIn ? <Login /> : <Navigate to="/" /> }/>
      <Route path='/signup' element={!isLoggedIn ? <Signup /> : <Navigate to="/" /> }/>
    </Routes>
  );
}

export default App;
