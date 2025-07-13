import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAuthUser } from "../lib/api";
import { useState, useEffect, useCallback } from "react";

const useAuthUser = () => {
  const { pathname } = useLocation();
  const [shouldEnableAuth, setShouldEnableAuth] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  const shouldSkipAuthCheck =
    pathname === "/" || pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    if (pathname === "/onboarding" || pathname === "/home") {
      const timer = setTimeout(() => {
        setShouldEnableAuth(true);
      }, 2000); // Delay for smoother UX

      return () => clearTimeout(timer);
    } else {
      setShouldEnableAuth(!shouldSkipAuthCheck);
    }
  }, [pathname, shouldSkipAuthCheck]);

  // Force auth check manually (e.g., after login)
  const forceAuthCheck = useCallback(() => {
    setShouldEnableAuth(true);
  }, []);

  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    enabled: shouldEnableAuth,
  });

  useEffect(() => {
    if (authUser.data?.user && tempUser) {
      console.log("Auth query available, clearing temp user");
      setTempUser(null);
    }
  }, [authUser.data?.user, tempUser]);

  const currentUser = tempUser || authUser.data?.user;

  return {
    isLoading: shouldSkipAuthCheck ? false : authUser.isLoading,
    authUser: currentUser,
    setTempUser,
    forceAuthCheck, // 🔥 this is new
  };
};

export default useAuthUser;
