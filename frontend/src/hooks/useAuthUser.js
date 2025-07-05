import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAuthUser } from "../lib/api";
import { useState, useEffect } from "react";

const useAuthUser = () => {
  const { pathname } = useLocation();
  const [shouldEnableAuth, setShouldEnableAuth] = useState(false);
  
  // Check if we're on pages where auth check should be skipped initially
  const shouldSkipAuthCheck = pathname === '/' || 
                             pathname === '/login' || 
                             pathname === '/signup';
  
  // Enable auth check after a delay for onboarding and home pages
  useEffect(() => {
    if (pathname === '/onboarding' || pathname === '/home') {
      const timer = setTimeout(() => {
        setShouldEnableAuth(true);
      }, 2000); // 2 second delay
      
      return () => clearTimeout(timer);
    } else {
      setShouldEnableAuth(!shouldSkipAuthCheck);
    }
  }, [pathname, shouldSkipAuthCheck]);
  
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
    enabled: shouldEnableAuth, // Enable based on state
  });

  return { 
    isLoading: shouldSkipAuthCheck ? false : authUser.isLoading, 
    authUser: authUser.data?.user 
  };
};
export default useAuthUser;