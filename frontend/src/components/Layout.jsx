import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = true }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {showSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={handleSidebarClose}
          />
        )}

        <div className="flex-1 flex flex-col">
          <Navbar onSidebarToggle={handleSidebarToggle} isSidebarOpen={isSidebarOpen} />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;