import { useState } from 'react'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import HomePage from './pages/HomePage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import Notifications from './pages/Notifications';

function App() {
  return (
    <>

    <Routes>
      <Route path='/' element={<LandingPage />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/onboarding' element={<Onboarding />}/>
      <Route path='/home' element={<HomePage />}/>
      <Route path='/call' element={<CallPage />}/>
      <Route path='/chat' element={<ChatPage />}/>
      <Route path='/notifications' element={<Notifications />}/>


    </Routes>
    </>
  )
}

export default App
