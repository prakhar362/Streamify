import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAuthUser } from "../lib/api";
import { useState, useEffect } from "react";

const useAuthUser = () => {
  const { pathname } = useLocation();
  const [shouldEnableAuth, setShouldEnableAuth] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  
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

  // Clear temp user when auth query becomes available
  useEffect(() => {
    if (authUser.data?.user && tempUser) {
      console.log("Auth query available, clearing temp user");
      setTempUser(null);
    }
  }, [authUser.data?.user, tempUser]);

  // Use tempUser if available, otherwise use authUser
  const currentUser = tempUser || authUser.data?.user;

  return { 
    isLoading: shouldSkipAuthCheck ? false : authUser.isLoading, 
    authUser: currentUser,
    setTempUser // Export this to be used by login/signup hooks
  };
};
export default useAuthUser;