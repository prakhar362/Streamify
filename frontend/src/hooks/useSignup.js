import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signup } from "../lib/api";

const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log("Signup successful:", data);
      // Navigate immediately based on user onboarding status
      if (data.user?.isOnboarded) {
        console.log("User is onboarded, navigating to /home");
        navigate("/home");
      } else {
        console.log("User is not onboarded, navigating to /onboarding");
        navigate("/onboarding");
      }
      
      // Don't invalidate auth query immediately - let the target page handle it
    },
  });

  return { isPending, error, signupMutation: mutate };
};
export default useSignUp;