import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../Slices/authSlice";
import {
  LayoutDashboard,
  Scan,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings
} from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  const activeClass = (path) =>
    location.pathname === path
      ? "text-orange-600 bg-orange-50 md:bg-transparent md:border-b-2 md:border-orange-600 md:rounded-none"
      : "text-gray-600 hover:text-green-700 transition";

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* LEFT: Logo & Hamburger (Mobile Only) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-green-900 bg-green-50"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>



            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-green-600 p-2 rounded-xl group-hover:rotate-12 transition">
                <span className="text-white text-2xl font-bold font-serif">AI</span>
              </div>
              <span className="text-2xl font-black text-green-900  tracking-tighter">
                Dairy<span className="text-orange-600">Pro</span>
              </span>
            </Link>
          </div>

          {/* MIDDLE: Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-wider">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-2 transition ${activeClass("/dashboard")}`}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/register-animal" className={`flex items-center gap-2 px-3 py-2 transition ${activeClass("/register-animal")}`}>
                  <Scan size={18} /> Register Animal
                </Link>


              </>
            )}
          </div>

          {/* RIGHT: User Profile & Auth */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <div className="flex gap-2 sm:gap-4 items-center">
                <Link to="/login" className="text-green-800 font-bold hover:text-green-600 text-sm sm:text-base">Login</Link>
                <Link to="/register" className="bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-bold hover:bg-green-800 shadow-lg shadow-green-100 transition active:scale-95 text-xs sm:text-sm">Join Now</Link>
              </div>
            ) : (
              <div className="relative">
                {/* Profile Circle Icon (Triggers Dropdown) */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 group p-1 rounded-full border-2 border-transparent hover:border-green-200 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-green-700" size={22} />
                    )}
                  </div>
                  <ChevronDown className={`text-gray-400 group-hover:text-green-700 transition hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} size={16} />
                </button>

                {/* DROPDOWN MENU */}
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                    <div ref={dropdownRef} className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl border border-green-50 z-20 overflow-hidden py-3 animate-in fade-in slide-in-from-top-4">
                      <div className="px-6 py-4 border-b border-gray-300/30 mb-2">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Logged in as</p>
                        <div className="w-full bg-green-600 p-2  mt-2 flex justify-around flex-wrap items-center rounded-2xl">

                          <p className="text-base font-bold text-white uppercase truncate">{user?.fullName}</p>
                          <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                            {user?.role}
                          </span>
                        </div>
                      </div>

                      <div className="px-2">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-green-100 hover:text-green-700 rounded-xl transition">
                          <User size={18} className="text-green-600" /> Flw Profile
                        </Link>
                        <Link to="/dashboard" className="flex md:hidden items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-green-50 rounded-xl transition">
                          <LayoutDashboard size={18} className="text-green-600" /> Dashboard
                        </Link>
                        <Link to="/register-animal" className="flex md:hidden items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-green-50 rounded-xl transition">
                          <Scan size={18} className="text-green-600" /> Register Animal
                        </Link>

                        {user?.role === "admin" && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-orange-600 bg-orange-50/50 hover:bg-orange-100 rounded-xl transition mt-1 border border-orange-100 border-dashed">
                            <ShieldAlert size={18} /> Admin Panel
                          </Link>
                        )}
                        <hr className="my-2 border-gray-50" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                          <LogOut size={18} /> Logout 
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER (MENU) */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-64 border-b border-green-50' : 'max-h-0'}`}>
        <div className="p-4 bg-white space-y-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`flex items-center gap-3 p-4 rounded-2xl font-black text-sm uppercase ${activeClass("/dashboard")}`}>
                <LayoutDashboard size={20} /> My Dashboard
              </Link>
              <Link to="/register-animal" className={`flex items-center gap-3 p-4 rounded-2xl font-black text-sm uppercase ${activeClass("/register-animal")}`}>
                <Scan size={20} /> Register New Animal
              </Link>
            </>
          ) : (
            <div className="p-2 space-y-4">
              <Link to="/login" className="block w-full text-center py-4 text-green-800 font-bold border border-green-100 rounded-2xl hover:bg-green-50">Login</Link>
              <Link to="/register" className="block w-full text-center py-4 bg-green-700 text-white font-black rounded-2xl shadow-xl shadow-green-100">Join Portal</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;