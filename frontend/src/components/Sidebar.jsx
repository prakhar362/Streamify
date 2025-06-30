import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, MessageCircleIcon, SettingsIcon, PlusIcon, XIcon } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      path: "/home",
      icon: HomeIcon,
      label: "Home",
    },
    {
      path: "/friends",
      icon: UsersIcon,
      label: "Friends",
    },
    {
      path: "/notifications",
      icon: BellIcon,
      label: "Notifications",
    }
  ];

  // Collapsed on desktop if not open, overlay on mobile if open
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`
          fixed z-50 top-0 left-0 h-screen transition-all duration-300
          ${isOpen ? 'w-64 bg-base-100 shadow-2xl' : 'w-16 bg-base-100/95'}
          border-r border-base-300 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:static lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className={`flex items-center ${isOpen ? 'justify-between p-4' : 'justify-center p-2'} border-b border-base-300 bg-gradient-to-r from-base-100 to-base-200/50`}>
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-200">
              <ShipWheelIcon className="size-8 text-primary drop-shadow-sm group-hover:scale-110 transition-transform duration-200" />
            </div>
            {isOpen && (
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Streamify
              </span>
            )}
          </Link>
          {/* Close button on mobile */}
          {isOpen && (
            <button className="btn btn-ghost btn-circle lg:hidden" onClick={onClose} aria-label="Close sidebar">
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 rounded-xl transition-all duration-200 mx-2 my-1
                  ${isOpen ? 'px-4 py-3' : 'justify-center p-3'}
                  ${isActive ? 'bg-primary/15 text-primary shadow-sm border border-primary/20' : 'text-base-content/70 hover:bg-primary/10 hover:text-primary'}
                `}
                title={item.label}
              >
                <Icon className="size-5" />
                {isOpen && <span className="font-medium">{item.label}</span>}
                {isActive && <div className="size-2 bg-primary rounded-full animate-pulse ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE SECTION */}
        <div className={`${isOpen ? 'p-4' : 'p-2'} bg-gradient-to-r from-base-200/50 to-base-100 mt-auto`}> 
          <div className={`flex items-center ${isOpen ? 'gap-2' : 'justify-center'} rounded-xl bg-base-100/50  hover:bg-base-200/50 transition-all duration-200 cursor-pointer group`}>
            <div className="avatar online">
              <div className="w-10 h-10 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                <img 
                  src={authUser?.profilePic || "https://via.placeholder.com/40x40"} 
                  alt="User Avatar" 
                  className="object-cover"
                />
              </div>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-base-content truncate">{authUser?.fullName}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Online
                </p>
              </div>
            )}
            {isOpen && (
              <button className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <SettingsIcon className="size-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;