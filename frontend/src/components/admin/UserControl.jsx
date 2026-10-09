import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { ShieldCheck, Mail, MapPin, Phone, ArrowLeft, Loader2, Power, Target, Award, MapPinIcon } from "lucide-react";
import toast from "react-hot-toast";

const UserControl = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [targetUser, setTargetUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/admin/worker/${id}`);
            setTargetUser(res.data.user);
            setStats(res.data.stats);
        } catch (err) {
            toast.error("User data not found");
            navigate("/admin/workers");
        } finally {
            setLoading(false);
        }
    };

    // 1. Toggle Active/Block Status
    const handleToggleStatus = async () => {
        setActionLoading(true);
        try {
            const res = await axiosClient.patch(`/admin/worker-status/${id}`);
            setTargetUser({ ...targetUser, isActive: res.data.user.isActive });
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        } finally {
            setActionLoading(false);
        }
    };

    // 2. Change Role Logic
    const handleRoleChange = async (newRole) => {
        setActionLoading(true);
        try {
            await axiosClient.put(`/admin/update-user-status`, { userId: id, newRole });
            setTargetUser({ ...targetUser, role: newRole });
            toast.success(`User upgraded to ${newRole}`);
        } catch (err) {
            // Agar ye Main Admin hua to Backend yahi se error fekega aur Toast show hoga
            toast.error(err.response?.data?.message || "Failed to change role");
        } finally {
            setActionLoading(false);
        }
    };
    const date = new Date();
    const joinDate = date.toDateString(targetUser?.createdAt);

    if (loading) return <div className="p-20 text-center font-bold text-gray-400">Verifying System Clearance...</div>;

    return (
        <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black text-green-900 uppercase text-xs hover:scale-105 transition">
                <ArrowLeft size={16} /> Back to Directory
            </button>

            <div className="max-w-4xl mx-auto bg-white rounded-[50px] shadow-2xl overflow-hidden border border-green-50">
                {/* User Header Section */}
                <div className="flex flex-col md:flex-row items-center p-10 gap-10 bg-gradient-to-br from-white to-gray-50">
                    <div className="relative group">
                        <div className={`w-32 h-32 rounded-[40px] flex items-center justify-center font-black text-4xl text-white shadow-2xl transition duration-500
                             ${targetUser?.role === 'admin' ? 'bg-orange-600 rotate-3' : 'bg-green-800'}`}>
                            {/* {targetUser?.fullName[0]} */}
                                   {targetUser?.profileImage ? (
                                                    <img src={targetUser?.profileImage } className="w-full h-full rounded-2xl object-cover" />
                                                ) : (
                                                    targetUser.fullName[0]
                                                )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">{targetUser?.fullName}</h2>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="bg-white border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Status: {targetUser?.isActive ? 'Operational' : 'Suspended'}
                            </span>
                            <span className={`${targetUser?.role == 'admin' ? 'bg-orange-600' : 'bg-green-600'} text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg`}>
                                Role: {targetUser?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Worker Stats & Contact Info */}
                <div className="grid md:grid-cols-2 p-10 gap-6 border-y border-gray-100">
                    <div className="bg-gray-50 p-6 rounded-[30px] flex items-center gap-4">
                        <Mail className="text-orange-600" />
                        <div><p className="text-[10px] uppercase font-bold text-gray-400">System Email</p><p className="font-black text-gray-800 text-sm">{targetUser?.email}</p></div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[30px] flex items-center gap-4">
                        <Phone className="text-orange-600" />
                        <div><p className="text-[10px] uppercase font-bold text-gray-400">Phone</p><p className="font-black text-gray-800 text-sm">{targetUser?.phoneNumber}</p></div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[30px] flex items-center gap-4">
                        <MapPinIcon className="text-orange-600" />
                        <div><p className="text-[10px] uppercase font-bold text-gray-400">Address</p><p className="font-black text-gray-800 text-sm">
                            {(targetUser?.village && (

                                <><span>village: {targetUser?.village} </span>,</>
                            ))}
                            {(targetUser?.district && (

                                <><span>Dist: {targetUser?.district} </span></>
                            ))}
                            {(targetUser?.stats && (
                                <>,
                                    <span>stats: {targetUser?.stats} </span>
                                </>
                            ))}

                        </p></div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[30px] flex items-center gap-4">
                        <MapPinIcon className="text-orange-600" />
                        <div><p className="text-[10px] uppercase font-bold text-gray-400">Joining</p><p className="font-black text-gray-800 text-sm">{joinDate}</p></div>
                    </div>
                    <div className="bg-green-50/50 p-6 rounded-[30px] flex items-center justify-between border border-green-100">
                        <div className="flex items-center gap-4">
                            <Target className="text-green-800" />
                            <div><p className="text-[10px] uppercase font-bold text-green-700">Records</p><p className="font-black text-green-900 text-xl">{stats?.totalRegistrations}</p></div>
                        </div>
                        <div className="text-right border-l border-green-100 pl-4">
                            <p className="text-[10px] uppercase font-bold text-green-700 italic">Efficiency</p>
                            <p className="font-black text-green-900 text-xl">{stats?.efficiency}%</p>
                        </div>
                    </div>
                </div>

                {/* ADVANCED PERMISSIONS CONTROL */}
                <div className="p-10 space-y-8 bg-white">
                    <h4 className="text-sm font-black uppercase tracking-[3px] text-gray-400 italic">Access Management</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Role Change Block */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14} /> Adjust Privilege Level</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleRoleChange("flw")}
                                    disabled={targetUser.role === "flw" || actionLoading}
                                    className="flex-1 py-4 rounded-2xl bg-gray-50 text-xs font-black text-gray-400 hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-100 transition disabled:opacity-20"
                                >
                                    SET AS FLW
                                </button>
                                <button
                                    onClick={() => handleRoleChange("admin")}
                                    disabled={targetUser.role === "admin" || actionLoading}
                                    className="flex-1 py-4 rounded-2xl bg-gray-50 text-xs font-black text-gray-400 hover:bg-orange-50 hover:text-orange-700 border border-transparent hover:border-orange-100 transition disabled:opacity-20 uppercase"
                                >
                                    GRANT ADMIN
                                </button>
                            </div>
                        </div>

                        {/* Suspension Block */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Power size={14} /> Operational Logic</p>
                            <button
                                onClick={handleToggleStatus}
                                disabled={actionLoading}
                                className={`w-full py-4 rounded-2xl font-black text-xs transition uppercase shadow-xl shadow-gray-100 active:scale-95
                                ${targetUser.isActive ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-green-700 text-white'}`}
                            >
                                {actionLoading ? "Syncing..." : targetUser.isActive ? "Restrict Account Access" : "Activate System Access"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserControl;