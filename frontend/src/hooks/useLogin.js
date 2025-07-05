import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Add a small delay to ensure the cookie is set before checking auth
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }, 100);
    },
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;