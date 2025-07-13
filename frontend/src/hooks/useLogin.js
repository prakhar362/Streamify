import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/api";
import useAuthUser from "./useAuthUser";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setTempUser, forceAuthCheck } = useAuthUser();

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log("Login successful:", data);

      // Set temp user for UI access
      setTempUser(data.user);

      // Trigger auth fetch immediately (so it doesn’t wait 2s)
      forceAuthCheck();

      // Wait for React Query to update authUser (optional, but cleaner)
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // Navigate to appropriate page
      if (data.user?.isOnboarded) {
        console.log("User is onboarded, navigating to /home");
        navigate("/home");
      } else {
        console.log("User is not onboarded, navigating to /onboarding");
        navigate("/onboarding");
      }
    },
    onError: (err) => {
      console.error("Login error:", err);
    },
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;
