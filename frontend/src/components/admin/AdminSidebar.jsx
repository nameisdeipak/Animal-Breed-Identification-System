import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, Users, Box, X, Home, MessageSquare } from "lucide-react";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menu = [
    { name: "Overview", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Pending Approvals", path: "/admin/approvals", icon: <ShieldCheck size={20} /> },
    { name: "Manage Workers", path: "/admin/workers", icon: <Users size={20} /> },
    { name: "Breed Settings", path: "/admin/breeds", icon: <Box size={20} /> },
  ];

  const activeClass = (path) => 
    location.pathname === path ? "bg-white text-green-900 shadow-xl" : "text-green-100 hover:bg-green-700/50";

  return (
    <>
      {/* Sidebar Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[120] lg:hidden" onClick={() => setIsOpen(false)} />}

      <div className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-green-900 transition-transform z-[130] 
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        <div className="p-8">
            <Link to="/" className="flex items-center gap-2 mb-10 text-white">
                <div className="bg-orange-500 p-2 rounded-xl"><span className="text-xl font-bold font-serif text-white">AI</span></div>
                <span className="text-2xl font-black italic tracking-tighter text-white uppercase">Console</span>
            </Link>

            <nav className="space-y-4">
               {menu.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeClass(item.path)}`}
                  >
                     {item.icon} {item.name}
                  </Link>
               ))}
               <hr className="border-green-800 opacity-50" />
               <Link to="/dashboard" className="flex items-center gap-4 px-6 py-4 text-green-300 hover:text-white font-bold text-xs uppercase tracking-widest">
                  <Home size={20}/> Exit Console
               </Link>
            </nav>
        </div>
      </div>
    </>
  );
};
export default AdminSidebar;