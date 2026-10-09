import { useState, useRef, useEffect } from "react";
import { Outlet, Navigate, Link, useLocation ,useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../Slices/authSlice";
import {
  LayoutDashboard, ShieldCheck, Users, LogOut, Menu, X,
  Bell, PawPrint, ShieldX, User, ChevronDown, Settings, Lock, ListTree, PackageSearch, UserCheck
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const AdminLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  if (!isAuthenticated || user?.role !== "admin") return <Navigate to="/login" />;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // for notification 
   useEffect(() => {
     fetchNotis();
  }, [location.pathname]); // Refresh when page changes

  const fetchNotis = async () => {
      try {
          const res = await axiosClient.get("/admin/notifications");
          setNotifications(res.data.notifications);
          setUnread(res.data.unreadCount);
      } catch (err) {}
  };

  const handleReadAll = async () => {
      await axiosClient.put("/admin/read-all");
      setUnread(0);
      setIsNotiOpen(false);
  };

  const navigateToAlert = (item) => {
      // Type ke base pe redirect karo
      if(item.type === 'new_registration') navigate(`/admin/pending-approvals`);
      if(item.type === 'user_enrollment') navigate(`/admin/workers/${item.linkId}`);
      setIsNotiOpen(false);
  };

  const menuItems = [
    { name: "Overview", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Pending Approvals", path: "/admin/pending-approvals", icon: <ShieldCheck size={20} /> },
    { name: "Manage Workers", path: "/admin/workers", icon: <Users size={20} /> },
    { name: "Manage Animals", path: "/admin/animals", icon: <PawPrint size={20} /> },
    { name: "Rejected Archives", path: "/admin/rejected", icon: <ShieldX size={20} /> },
  ];

  return (
    // FIX 1: Use h-screen aur overflow-hidden root level pe (Taaki browser ka scrollbar gayab ho jaye)
    <div className="flex bg-[#F5F8F5] h-screen overflow-hidden">

      {/* 1. SIDEBAR */}
      <aside className={`fixed lg:relative top-0 left-0 h-full w-72 bg-green-950 text-white z-[120] transition-transform duration-300 shadow-2xl flex-shrink-0 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10 px-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-orange-600 p-2 rounded-xl text-xl font-black shadow-lg">AD</div>
              <span className="text-xl font-black italic tracking-widest uppercase">Admin</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-green-300 hover:text-white"><X size={24} /></button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => (
              <Link key={item.name} to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-[2px] transition-all
                ${location.pathname === item.path ? 'bg-white text-green-950 shadow-xl' : 'hover:bg-white/10 text-green-100/60 hover:text-white'}`}>
                {item.icon} {item.name}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 mt-6">
            <button onClick={() => dispatch(logoutUser())} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white transition font-black text-[10px] uppercase tracking-widest">
              <LogOut size={18} /> System Sign-Out
            </button>
          </div>
        </div>
      </aside>

      {/* 2. RIGHT PANEL (Main Layout Area) */}
      {/* FIX 2: relative h-full aur flex-col (Control setup for sticky items) */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">

        {/* FIX 3: Header ko flexible rehne do lekin fixed position ke bina content ke upar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 bg-green-50 text-green-900 rounded-xl">
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[3px] leading-none mb-1">Authenticated</p>
              <h4 className="font-black text-green-900 italic tracking-tighter uppercase leading-none text-xs">Administrative Console</h4>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* <div className="relative p-2 text-gray-400 cursor-not-allowed hidden sm:block"><Bell size={18} /></div> */}
              {/* Notificatioin UI  */}
                 <div className="relative"  >
                <button 
                   onClick={() => setIsNotiOpen(!isNotiOpen)}
                   className="relative p-2.5 bg-gray-50 rounded-full hover:bg-green-100 transition duration-300"
                >
                  <Bell size={20} className={unread > 0 ? "text-green-700 animate-pulse" : "text-gray-400"} />
                  {unread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                        {unread}
                      </span>
                  )}
                </button>

                {/* NOTI BOX OVERLAY */}
                {isNotiOpen && (
                   <>
                   <div className="fixed inset-0 z-40" onClick={()=>setIsNotiOpen(false)}></div>
                   <div className="absolute right-0 mt-4 w-96 bg-white rounded-[32px] shadow-2xl border border-green-50 z-50 overflow-hidden py-6 animate-in slide-in-from-top-4 duration-300">
                        <div className="px-8 mb-4 flex justify-between items-center border-b border-gray-50 pb-4">
                           <h3 className="font-black text-gray-800 uppercase italic text-xs tracking-widest">Real-time Stream</h3>
                           <button onClick={handleReadAll} className="text-[10px] font-black text-green-700 underline">MARK CLEAR</button>
                        </div>

                        <div className="max-h-96 overflow-y-auto no-scrollbar px-2 space-y-2">
                            {notifications.map(item => (
                                <div key={item._id} onClick={() => navigateToAlert(item)} 
                                  className={`p-5 rounded-[24px] cursor-pointer transition flex gap-4 
                                  ${item.isRead ? 'bg-transparent grayscale opacity-50' : 'bg-green-50/50 hover:bg-green-50 border-l-4 border-green-700'}`}>
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm shrink-0">
                                       {item.type === 'new_registration' ? <PackageSearch size={18} className="text-orange-500" /> : <UserCheck size={18} className="text-green-700"/>}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                       <p className="text-[11px] font-black text-gray-800 leading-tight truncate">{item.message}</p>
                                       <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-tighter italic">
                                         {new Date(item.createdAt).toLocaleTimeString()}
                                       </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {notifications.length === 0 && <p className="text-center py-10 text-gray-300 font-bold">Silence... All good.</p>}
                   </div>
                   </>
                )}
            </div>


            {/* Profile Dropdown Area */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-gray-50 border-2 border-transparent active:border-green-200">
                <div className="w-10 h-10 rounded-full border-2 border-orange-200 p-0.5 overflow-hidden">
                  <img src={user?.profileImage || "https://ui-avatars.com/api/?name=Admin"} alt="admin" className="w-full h-full rounded-full object-cover" />
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-green-700' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-[32px] shadow-2xl border border-green-50 p-2 py-4 animate-in fade-in slide-in-from-top-2">
                  <div className="px-6 py-4 bg-green-50 rounded-[24px] mb-2 mx-2 text-center md:text-left">
                    <p className="font-black text-gray-900 truncate leading-tight uppercase italic text-xs mb-0.5">{user?.fullName}</p>
                    <p className="text-[9px] font-bold text-gray-400 lowercase tracking-widest">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Link to="/admin/profile" className="flex items-center gap-3 px-6 py-3 text-[11px] font-black text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-2xl transition uppercase tracking-widest"><User size={16} /> Admin Profile</Link>
                    <Link to="/admin/security-update" className="flex items-center gap-3 px-6 py-3 text-[11px] font-black text-gray-600 hover:bg-green-50 hover:text-orange-600 rounded-2xl transition uppercase tracking-widest"><Lock size={16} /> Update Keys</Link>
                    <hr className="my-2 border-gray-50 mx-4" />
                    <button onClick={() => dispatch(logoutUser())} className="w-full flex items-center gap-3 px-6 py-3 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-2xl transition uppercase tracking-widest"><LogOut size={16} /> Log Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. SCROLLABLE AREA */}
        {/* FIX 4: Overflow-y-auto yahan lagaao taaki sirf data scroll ho Header nahi */}
        <main className="flex-1 overflow-y-auto bg-[#F5F8F5] p-4 md:p-10 no-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;







