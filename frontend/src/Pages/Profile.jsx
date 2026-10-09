import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, MapPin, Phone, Camera, ShieldCheck, MapIcon, RotateCcwKey, Building } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { updateUser } from "../Slices/authSlice";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(user?.profileImage);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalRegistered: 0, efficiencyScore: 0 });


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosClient.get("/animal/stats");
                setStats(res.data.stats);
            } catch (err) { }
        };
        fetchStats();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append("profileImage", imageFile);

        try {
            const res = await axiosClient.put("/auth/update-profile", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setEditing(false);
            toast.success(res?.data?.message || "Profile is Updated successfully ");

            dispatch(updateUser(res.data.user));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPhone, setNewPhone] = useState(user?.phoneNumber || "");

    // Phone Update Flow
    const handleSendOtp = async () => {
        try {
            await axiosClient.post("/auth/send-phone-otp", { phoneNumber: newPhone });
            setIsOtpSent(true);
            toast.success("OTP Sent!");
        } catch (err) { toast.error("Failed to send OTP"); }
    };

    const handleVerifyOtp = async () => {
        try {
            const res = await axiosClient.post("/auth/verify-phone-otp", { phoneNumber: newPhone, otp });
            dispatch(updateUser(res.data.user));
            setIsOtpSent(false);
            setOtp("");
            toast.success("Phone Verified!");
        } catch (err) { toast.error("Wrong OTP"); }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF0] pb-20">
            {/* Cover Backdrop */}
            <div className="h-48 bg-gradient-to-r from-green-800 to-green-600 relative">
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 lg:left-32 lg:translate-x-0">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[40px] border-8 border-[#FDFCF0] bg-white overflow-hidden shadow-xl shadow-green-900/10">
                            <img src={preview || "https://ui-avatars.com/api/?name=" + user?.fullName} className="w-full h-full object-cover" />
                        </div>
                        {editing && (
                            <label className="absolute bottom-2 right-2 bg-orange-600 p-2 rounded-xl text-white cursor-pointer hover:scale-110 transition shadow-lg">
                                <Camera size={16} />
                                <input type="file" className="hidden" onChange={(e) => {
                                    setImageFile(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }} />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Bio Card */}
                <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-green-800/5 h-fit border border-green-50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-200">Official Profile</span>
                        <button onClick={() => setEditing(!editing)} className="text-sm font-bold text-gray-500 cursor-pointer">{editing ? "Cancel" : "Edit Profile"}</button>

                    </div>


                    <h2 className="text-3xl font-black text-gray-900 leading-tight">{user?.fullName}</h2>
                    <p className="flex items-center gap-2 text-gray-500 font-medium mt-1 uppercase tracking-tighter"><ShieldCheck size={14} className="text-green-600" /> ID: FLW-00{user?._id?.slice(-4)}</p>

                    <div className="mt-8 space-y-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl">
                            <Mail className="text-green-700" size={20} />
                            <span className="font-medium text-sm">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl">
                            <Phone className="text-green-700" size={20} />
                            <span className="font-medium text-sm">{user?.phoneNumber || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl italic">
                            <MapPin className="text-green-700" size={20} />
                            <span className="font-medium text-sm">{user?.village}, {user?.district}, {user?.state}</span>
                        </div>

                     <button
                            onClick={()=> navigate("/change-password")}
                            className={`w-full cursor-pointer items-center p-4 rounded-2xl text-sm font-bold transition bg-orange-500 text-white  shadow-xl shadow-gray-100 active:scale-95`} >
      
                            Change Password
                        </button>
                    </div>

                </div>

                {/* Action/Update Card */}
                <div className="lg:col-span-2 space-y-6">
                    {editing ? (
                        <div className="space-y-6">
                            {/* Standard Details Form */}
                            <form onSubmit={handleUpdate} className="bg-[#1b2b1d] p-10 rounded-[40px] text-white shadow-2xl animate-in fade-in duration-500">
                                <h3 className="text-2xl font-black mb-8 italic">Basic Credentials</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-green-400 opacity-60 ml-2">Full Name</label>
                                        <input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 outline-none focus:border-green-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-green-400 opacity-60 ml-2">Village</label>
                                        <input value={formData.village} onChange={(e) => setFormData({ ...formData, village: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 outline-none focus:border-green-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-green-400 opacity-60 ml-2">District</label>
                                        <input value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 outline-none focus:border-green-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-green-400 opacity-60 ml-2">State</label>
                                        <input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 outline-none focus:border-green-500" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="mt-8 w-full bg-white text-green-900 font-black py-4 rounded-2xl shadow-xl transition active:scale-95">
                                    {loading ? "Syncing..." : "Update Bio Details"}
                                </button>
                            </form>

                            {/* Mobile Number Update Section (DEDICATED SECTION) */}
                            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-orange-100 border-dashed">
                                <h3 className="text-xl font-black text-gray-900 mb-6 italic underline underline-offset-4 decoration-orange-300 flex items-center gap-2"> <Phone size={20} className="text-orange-600" /> Security Contact Update</h3>

                                {!isOtpSent ? (
                                    <div className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">New Mobile Number (+91)</label>
                                            <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+91xxxxxxxxxx" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-orange-500 outline-none font-bold" />
                                        </div>
                                        <button onClick={handleSendOtp} className="bg-green-700 text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-800 transition">Get Code</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-black uppercase text-green-700 ml-2">Enter 6-Digit OTP</label>
                                            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="0 0 0 0 0 0" maxLength={6} className="w-full bg-green-50 border border-green-200 rounded-2xl py-3.5 px-4 tracking-[10px] text-center font-black text-lg focus:ring-2 focus:ring-green-700 outline-none" />
                                        </div>
                                        <button onClick={handleVerifyOtp} className="bg-orange-600 text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition">Verify Code</button>
                                        <button onClick={() => setIsOtpSent(false)} className="text-gray-400 font-bold underline text-xs pb-4">Change Phone</button>
                                    </div>
                                )}
                                <p className="mt-4 text-[10px] font-medium text-gray-400">System par verified number hone se sarkari alerts aap tak jaldi pahunchenge.</p>
                            </div>
                        </div>
                    ) : (
                        <>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-green-50 flex flex-col justify-center">
                                    <span className="text-xs font-black text-orange-600 uppercase mb-2">My Total Logs</span>
                                    <h3 className="text-5xl font-black text-green-900 tracking-tight">{stats.totalRegistered}</h3>
                                    <p className="text-gray-400 font-medium text-xs mt-1 italic">Entries registered by you</p>
                                </div>
                                <div className="bg-green-700 p-8 rounded-[40px] text-white flex flex-col justify-center shadow-lg shadow-green-100">
                                    <span className="text-xs font-black uppercase mb-2 opacity-70">Efficiency Rating</span>
                                    <h3 className="text-5xl font-black tracking-tight">{stats.efficiencyScore}%</h3>
                                    <p className="text-green-100 font-medium text-xs mt-1 italic">Post-verification score</p>
                                </div>
                            </div>


                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-green-50">
                                <h4 className="font-black text-lg mb-6 flex items-center gap-2 italic underline underline-offset-8 decoration-2 decoration-green-100"><MapIcon size={20} className="text-green-600" /> Regional Reach</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">You are currently monitoring <span className="font-bold text-gray-900 underline underline-offset-4 decoration-orange-200">5 sectors</span> within your district. Accuracy of predictions is maintaining an upward trend.</p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    {['Village Census', 'Vaccination Data', 'Milk Logs', 'Breed Prediction History'].map(tag => (
                                        <span key={tag} className="bg-green-50 text-green-800 text-[10px] font-bold py-2 px-4 rounded-full border border-green-100 uppercase tracking-wide hover:bg-green-700 hover:text-white transition cursor-pointer">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;


