import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../Slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Clock, ShieldAlert, LogOut, MessageCircle, HelpCircle } from 'lucide-react';

const AccountStatus = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Check ki ye naya user hai ya Admin ne suspend kiya hai
    // logic: agar naya account hai (maan lo 1 ghante pehle bana), to verification bolenge.
    // simpler logic: aap isActive: false par hamesha warning dikhao.
    
    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6 text-center">
            <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl p-10 md:p-20 border border-green-50 relative overflow-hidden">
                
                {/* Abstract Background Design */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-100/50 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-100/50 rounded-full blur-3xl"></div>

                <div className="relative z-10 space-y-8">
                    <div className="flex justify-center">
                        <div className="bg-orange-50 p-6 rounded-[35px] border border-orange-100 shadow-xl shadow-orange-50/50 animate-bounce duration-[2000ms]">
                            <ShieldAlert size={60} className="text-orange-600" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                            System Access <br/><span className="text-green-700 not-italic">Restricted</span>
                        </h1>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto">
                            Hello {user?.fullName.split(' ')[0]}, humari security team aapki identity aur documents verify kar rahi hai.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-6 rounded-3xl text-left border border-gray-100">
                            <Clock className="text-green-700 mb-2" size={24}/>
                            <h3 className="font-black text-gray-800 uppercase text-xs">Primary Verification</h3>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">Checking Worker Role & Village Assignments...</p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-3xl text-left border border-red-100">
                            <MessageCircle className="text-red-700 mb-2" size={24}/>
                            <h3 className="font-black text-gray-800 uppercase text-xs">Need Help?</h3>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">If this takes more than 24h, contact Dept. Admin.</p>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col items-center gap-4 border-t border-gray-50">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic opacity-50">Log back in once verified</p>
                        <button 
                            onClick={handleLogout}
                            className="bg-green-950 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-black transition shadow-xl shadow-green-100 active:scale-95"
                        >
                            <LogOut size={16}/> Terminate Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountStatus;