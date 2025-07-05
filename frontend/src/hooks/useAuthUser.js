import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const { pathname } = useLocation();
  
  // Check if we're on pages where auth check should be skipped
  const shouldSkipAuthCheck = pathname === '/' || 
                             pathname === '/login' || 
                             pathname === '/signup';
  
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
    enabled: !shouldSkipAuthCheck, // Skip auth check on landing, login, and signup pages
  });

  return { 
    isLoading: shouldSkipAuthCheck ? false : authUser.isLoading, 
    authUser: authUser.data?.user 
  };
};
export default useAuthUser;