import { useState, useEffect } from 'react'
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
import Layout from './components/Layout.jsx';
import { useThemeStore } from './store/useThemeStore.js';

function App() {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  // Don't show loader for landing page since it doesn't need auth
  const currentPath = window.location.pathname;
  const isLandingPage = currentPath === '/';
  
  if (isLoading && !isLandingPage) return <PageLoader />;
  
  return (
    <>
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'hsl(var(--b1))',
          color: 'hsl(var(--bc))',
          border: '1px solid hsl(var(--b3))',
        },
      }}
    />
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
              !isOnboarded ? ( <Onboarding /> ) : (  <Navigate to="/home" /> )
            ) : 
              ( <Navigate to="/login" /> )
          }
          />


      <Route path='/home' element={
        isAuthenticated && isOnboarded ? (
          <Layout>
          <HomePage />
          </Layout> 
        ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
        }/>

      <Route path='/friends' element={
        isAuthenticated && isOnboarded ? (
          <Layout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Friends</h1>
              <p className="text-base-content/70">Friends page coming soon...</p>
            </div>
          </Layout>
        ) : (
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
