import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast";


import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import HomePage from './pages/HomePage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import Notifications from './pages/Notifications';

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";

function App() {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  // Don't show loader for landing page since it doesn't need auth
  const currentPath = window.location.pathname;
  const isLandingPage = currentPath === '/';
  
  if (isLoading && !isLandingPage) return <PageLoader />;
  
  return (
    <>
    <Routes>
      <Route path='/' element={<LandingPage />}/>

      <Route path='/login'  element={
            !isAuthenticated ? <Login /> : <Navigate to={isOnboarded ? "/home" : "/onboarding"} />
          }/>

      <Route path='/signup' element={
            !isAuthenticated ? <Signup /> : <Navigate to={isOnboarded ? "/home" : "/onboarding"} />
          }/>


      <Route path='/onboarding' element={
            isAuthenticated ? (
              !isOnboarded ? ( <Onboarding /> ) : (  <Navigate to="/" /> )
            ) : 
              ( <Navigate to="/login" /> )
          }
          />


      <Route path='/home' element={
        isAuthenticated && isOnboarded ? (<HomePage />) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
        }/>

      <Route path='/call/:id'  element={
            isAuthenticated && isOnboarded ? (
              <CallPage /> ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }/>

          
      <Route path='/chat/:id'  element={
            isAuthenticated && isOnboarded ? (
                <ChatPage /> ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }/>

      <Route path='/notifications' element={
            isAuthenticated && isOnboarded ? (
                <Notifications /> ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
          />
    </Routes>
    </>
  )
}

export default App
