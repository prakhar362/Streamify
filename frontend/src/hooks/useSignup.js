import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signup } from "../lib/api";
import useAuthUser from "./useAuthUser";

const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setTempUser, forceAuthCheck } = useAuthUser();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      console.log("Signup successful:", data);

      // Set temp user for immediate UI access
      setTempUser(data.user);

      // Enable /auth/me check immediately
      forceAuthCheck();

      // Refetch auth state to sync with backend
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // Navigate based on onboarding status
      if (data.user?.isOnboarded) {
        console.log("User is onboarded, navigating to /home");
        navigate("/home");
      } else {
        console.log("User is not onboarded, navigating to /onboarding");
        navigate("/onboarding");
      }
    },
    onError: (err) => {
      console.error("Signup error:", err);
    },
  });

  return { isPending, error, signupMutation: mutate };
};

export default useSignUp;
