import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import useAuthUser from "./useAuthUser";

const useLogout = () => {
  const queryClient = useQueryClient();
  const { setTempUser } = useAuthUser(); // clear temp user if set

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      // Clear any temp user state
      setTempUser(null);

      // Clear cached user info
      await queryClient.removeQueries({ queryKey: ["authUser"] });

      // Optional: you can also redirect to login here if needed
      // navigate("/login");
    },
    onError: (err) => {
      console.error("Logout failed:", err);
    },
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;
