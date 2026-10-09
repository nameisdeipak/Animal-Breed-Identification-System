import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, MapPin, Camera, Save, Edit3, ShieldCheck, MapIcon, BadgeInfo } from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import { updateUser } from "../../Slices/authSlice";
import toast from "react-hot-toast";

const AdminProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(user?.profileImage);

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
            toast.success("Identity profile updated!");
            dispatch(updateUser(res.data.user));
            setEditing(false);
        } catch (err) {
            toast.error("Failed to sync changes");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">
            {/* Header Title */}
            <div className="border-l-8 border-green-900 pl-4 py-1">
                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Profile Console</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Master Identity Management</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* 1. Identity Card (Visual) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[50px] shadow-2xl p-8 border border-green-50 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-green-900 to-green-700 opacity-10"></div>
                        
                        <div className="relative pt-10">
                            <div className="w-32 h-32 mx-auto rounded-[40px] border-4 border-white shadow-xl overflow-hidden group-hover:rotate-3 transition duration-500 relative">
                                <img src={preview || "https://ui-avatars.com/api/?name=Admin"} className="w-full h-full object-cover" alt="Admin" />
                                {editing && (
                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24}/>
                                        <input type="file" className="hidden" onChange={(e) => {
                                            const file = e.target.files[0];
                                            setImageFile(file);
                                            setPreview(URL.createObjectURL(file));
                                        }}/>
                                    </label>
                                )}
                            </div>
                            
                            <h3 className="text-2xl font-black text-gray-900 mt-6 tracking-tight uppercase italic">{user?.fullName}</h3>
                            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[3px] mt-2 border border-orange-200">
                                Global Access
                            </span>
                        </div>

                        <div className="mt-8 space-y-4 pt-8 border-t border-gray-100 text-left">
                            <InfoRow icon={<Mail size={16}/>} label="Email ID" value={user?.email}/>
                            <InfoRow icon={<ShieldCheck size={16}/>} label="User Status" value={user?.isActive ? 'Active Official' : 'Restricted'}/>
                        </div>
                    </div>
                </div>

                {/* 2. Management Form (Control Area) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#122114] p-10 rounded-[50px] shadow-2xl text-white">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-bold flex items-center gap-2 italic">
                                <BadgeInfo size={24} className="text-orange-500" /> Identity Synchronization
                            </h3>
                            <button 
                                onClick={() => setEditing(!editing)}
                                className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-white hover:text-green-950 transition duration-300"
                            >
                                {editing ? "Cancel Changes" : "Access Bio Controls"}
                            </button>
                        </div>

                        {editing ? (
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
                                <Field edit label="Operational Full Name" value={formData.fullName} onChange={(v) => setFormData({...formData, fullName: v})}/>
                                <Field edit label="Active District" value={formData.district} onChange={(v) => setFormData({...formData, district: v})}/>
                                <Field edit label="Headquarter State" value={formData.state} onChange={(v) => setFormData({...formData, state: v})}/>
                                <Field edit label="Operational Village" value={formData.village} onChange={(v) => setFormData({...formData, village: v})}/>
                                
                                <div className="md:col-span-2 pt-6">
                                    <button disabled={loading} type="submit" className="w-full bg-orange-600 hover:bg-orange-500 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition active:scale-95">
                                        {loading ? "Syncing..." : <><Save size={20}/> Encrypt and Save Identity</>}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 py-10 opacity-70">
                                <Field label="Name Registered" value={user?.fullName} />
                                <Field label="Region Detail" value={`${user?.village}, ${user?.district},${user?.state}`} />
                                <Field label="Access Layer" value={user?.role} />
                                <Field label="Personnel ID" value={`ID-000-${user?._id.slice(-4)}`} />
                            </div>
                        )}
                    </div>

                    <div className="bg-white border-l-8 border-orange-500 p-8 rounded-r-3xl shadow-sm italic text-gray-500 text-sm font-medium">
                        "Notice: Official identity changes are logged and monitored by the primary audit department."
                    </div>
                </div>
            </div>
        </div>
    );
};

// UI Components
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 py-2">
        <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-900 flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">{label}</p>
            <p className="font-bold text-gray-800 text-sm truncate italic uppercase tracking-tighter leading-none">{value}</p>
        </div>
    </div>
);

const Field = ({ label, value, edit, onChange }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-[3px] text-green-400 opacity-60 ml-2 italic">{label}</label>
        {edit ? (
            <input 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:bg-white/10 outline-none focus:border-green-500 transition duration-300"
                value={value} onChange={(e) => onChange(e.target.value)} 
            />
        ) : (
            <p className="bg-white/5 p-4 rounded-2xl text-base font-black text-white italic tracking-tight">{value || "---"}</p>
        )}
    </div>
);

export default AdminProfile;