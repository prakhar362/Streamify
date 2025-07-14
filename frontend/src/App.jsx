import { useState, useEffect } from 'react'
import './App.css'
import { Routes,Route, Navigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast";


import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import HomePage from './pages/HomePage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import Notifications from './pages/Notifications';
import GroupPage from './pages/GroupPage';
import GroupRequests from './pages/GroupRequests';
import GroupDetailPage from './pages/GroupDetailPage';

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from './store/useThemeStore.js';
import { useLocation } from "react-router-dom";

function App() {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
   const { pathname } = useLocation();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  // Apply theme to document
  useEffect(() => {
    if (pathname === "/" || pathname === "/landing") {
      document.documentElement.setAttribute('data-theme','none');
    }

    document.documentElement.setAttribute('data-theme', theme);
  }, [theme,pathname]);

   if (isLoading) return <PageLoader />;
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
      <Route path='/' element={<LandingPage />} />

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
        isAuthenticated && isOnboarded ? (
          <Layout>
            <HomePage />
          </Layout>
        ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
        }/>
<Route
  path="/call/:id"
  element={
    isLoading ? (
      <PageLoader />
    ) : authUser ? (
      authUser.isOnboarded ? (
        <>
          {console.log("✅ User is authenticated and onboarded. Rendering CallPage.")}
          <Layout showSidebar={false}>
            <CallPage />
          </Layout>
        </>
      ) : (
        <>
          {console.log("⚠️ User authenticated but not onboarded. Redirecting to /onboarding")}
          <Navigate to="/onboarding" />
        </>
      )
    ) : (
      <PageLoader /> // Wait instead of redirecting immediately
    )
  }
/>



          
      <Route path='/chat/:id'  element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }/>

      <Route path='/notifications' element={
            isAuthenticated && isOnboarded ? (
              <Layout>
                <Notifications />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
          />

      <Route path='/groups' element={
            isAuthenticated && isOnboarded ? (
              <Layout>
                <GroupPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
          />

      <Route path='/group-requests' element={
            isAuthenticated && isOnboarded ? (
              <Layout>
                <GroupRequests />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
          />

      <Route path='/group/:id' element={
        isAuthenticated && isOnboarded ? (
          <Layout>
            <GroupDetailPage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )
      }/>
    </Routes>
    </>
  )
}

export default App
