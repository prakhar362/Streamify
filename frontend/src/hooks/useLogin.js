import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Add a delay to ensure the cookie is set and auth state is updated
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        // Navigate based on user onboarding status
        if (data.user?.isOnboarded) {
          console.log("User is onboarded, navigating to /home");
          navigate("/home");
        } else {
          console.log("User is not onboarded, navigating to /onboarding");
          navigate("/onboarding");
        }
      }, 500); // Increased delay to 500ms
    },
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;