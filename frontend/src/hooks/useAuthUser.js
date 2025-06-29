import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  // Check if we're on the landing page
  const isLandingPage = window.location.pathname === '/';
  
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
    enabled: !isLandingPage, // Skip auth check on landing page
  });

  return { 
    isLoading: isLandingPage ? false : authUser.isLoading, 
    authUser: authUser.data?.user 
  };
};
export default useAuthUser;