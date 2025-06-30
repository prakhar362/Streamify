import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, SearchIcon, PanelRight } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = ({ onSidebarToggle, isSidebarOpen }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-100/80 backdrop-blur-lg border-b border-base-300 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center h-full ${!isSidebarOpen ? 'pl-0 ml-1' : ''}`}>
        {/* Sidebar toggle button: absolute left when sidebar is collapsed, normal when open */}
        <button
          className={`btn btn-ghost btn-circle mr-2 transition-all duration-200 ${!isSidebarOpen ? 'absolute left-2 z-20' : ''}`}
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          <PanelRight className="h-5 w-5" />
        </button>

        <div className={`flex items-center justify-between w-full ${!isSidebarOpen ? 'pl-12' : ''}`}>
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5 hover:scale-105 transition-transform duration-200">
                <ShipWheelIcon className="size-8 text-primary drop-shadow-sm" />
                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          {/* SEARCH BAR - CENTER */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search friends, messages..."
                className="input input-bordered w-full pl-10 pr-4 bg-base-200/50 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-2 sm:gap-3 w-full justify-end md:justify-end lg:justify-end">
              {/* NOTIFICATIONS */}
              <Link to={"/notifications"}>
                <button className="btn btn-ghost btn-circle relative hover:bg-primary/10 transition-colors duration-200 group">
                  <BellIcon className="h-5 w-5 text-base-content/70 group-hover:text-primary transition-colors duration-200" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 size-2 bg-error rounded-full animate-pulse"></span>
                </button>
              </Link>

              {/* THEME SELECTOR */}
              <ThemeSelector />

              {/* USER PROFILE */}
              <div className="flex items-center gap-3">
                <div className="avatar online">
                  <div className="w-9 h-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200 cursor-pointer">
                    <img 
                      src={authUser?.profilePic || "https://via.placeholder.com/36x36"} 
                      alt="User Avatar" 
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* LOGOUT BUTTON */}
              <button 
                className="btn btn-ghost btn-circle hover:bg-error/10 hover:text-error transition-all duration-200 group" 
                onClick={logoutMutation}
                title="Logout"
              >
                <LogOutIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;