
import React, { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import { User, Mail, Award, Target, Trash2, ShieldCheck, ShieldAlert, Edit, MoreVertical, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManageWorkers = () => {
    const [workers, setWorkers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { fetchWorkers(); }, [page]);

    const fetchWorkers = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/admin/all-workers?page=${page}&limit=8`);
            setWorkers(res.data.workers);
            setTotalPages(res.data.totalPages);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await axiosClient.patch(`/admin/worker-status/${id}`);
            toast.success(res.data.message);
            fetchWorkers();
        } catch (err) { toast.error("Action Failed"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to Delete worker recored if delete user than all history will be  deleted of user?")) return;
        try {
            const res = await axiosClient.delete(`/admin/delete-worker/${id}`);
            toast.success("Worker Removed");
            fetchWorkers();
        } catch (err) {
            toast.error( err.response?.data?.message || "Delete Failed" );
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-8 border-green-700 pl-4">
                <div>
                    <h2 className="text-3xl font-black text-green-950 uppercase italic tracking-tighter">Field Force Directory</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Manage personnel, status and regional reach</p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-green-800" size={40} /></div>
            ) : (
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-green-50">
                    <table className="w-full text-left border-collapse">
                        {/* Desktop Header */}
                        <thead className="hidden lg:table-header-group bg-gray-50 border-b border-gray-100 font-black uppercase text-[10px] text-gray-400 tracking-[3px]">
                            <tr>
                                <th className="px-8 py-6 text-green-800 italic uppercase tracking-normal text-sm font-black">Officer Identity</th>
                                <th className="px-6 py-6">Working Area</th>
                                <th className="px-6 py-6">Stats (Reg/Eff.)</th>
                                <th className="px-6 py-6">Security Status</th>
                                <th className="px-8 py-6">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="flex flex-col lg:table-row-group divide-y divide-gray-100">
                            {workers.map((worker) => (
                                <tr key={worker._id} className="flex flex-col lg:table-row group hover:bg-green-50/40 transition">

                                    {/* Identity */}
                                    <td className="px-8 py-6 flex justify-between lg:table-cell items-center">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center font-black text-xl text-white shadow-xl ${worker.isActive ? 'bg-green-900' : 'bg-red-900 grayscale opacity-50'}`}>
                                                {worker?.profileImage ? (
                                                    <img src={worker?.profileImage} className="w-full h-full rounded-2xl object-cover" />
                                                ) : (
                                                    worker.fullName[0]
                                                )}

                                            </div>
                                            <div>
                                                <p className="text-base font-black text-gray-900 leading-tight uppercase italic">{worker.fullName}</p>
                                                <p className="text-xs font-bold text-gray-400 italic lowercase">{worker.email}</p>
                                                <p className="text-xs font-bold text-gray-400  ">Role: <span className="text-orange-600">{worker.role}</span></p>
                                            </div>
                                        </div>
                                        <div className="lg:hidden text-[10px] bg-gray-100 px-3 py-1 rounded-full font-black uppercase tracking-widest text-gray-400">Identity</div>
                                    </td>

                                    {/* Area */}
                                    <td className="px-8 py-4 lg:py-6 lg:table-cell flex justify-between items-center border-t lg:border-none">
                                        <span className="lg:hidden text-[10px] uppercase font-black text-gray-400 italic">Operating Region</span>
                                        <div className="text-right lg:text-left">
                                            <p className="font-black text-gray-800 text-xs tracking-tighter uppercase">{worker.village}</p>
                                            <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest opacity-60 italic">{worker.district}</p>
                                        </div>
                                    </td>

                                    {/* Stats */}
                                    <td className="px-8 py-4 lg:py-6 lg:table-cell flex justify-between items-center border-t lg:border-none">
                                        <span className="lg:hidden text-[10px] uppercase font-black text-gray-400 italic">Work Logs</span>
                                        <div className="flex gap-4 lg:gap-8 items-center text-right lg:text-left font-mono">
                                            <div><span className="text-[10px] block opacity-40 font-bold">REGS</span><span className="text-lg font-black">{worker.totalRegistrations}</span></div>
                                            <div><span className="text-[10px] block opacity-40 font-bold text-green-700 underline underline-offset-4 decoration-2">EFF %</span><span className="text-lg font-black">{worker.efficiency}%</span></div>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-8 py-4 lg:py-6 lg:table-cell flex justify-between items-center border-t lg:border-none">
                                        <span className="lg:hidden text-[10px] uppercase font-black text-gray-400 italic">Control Status</span>
                                        <button onClick={() => handleToggleStatus(worker._id)}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all shadow-md active:scale-90
                                           ${worker.isActive ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                            {worker.isActive ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                            {worker.isActive ? "ACCOUNT ACTIVE" : "ACCESS BLOCKED"}
                                        </button>
                                    </td>

                                    {/* Action Buttons */}
                                    <td className="px-8 py-6 lg:table-cell border-t lg:border-none">
                                        <div className="flex gap-3 justify-end lg:justify-start">

                                            <button onClick={() => navigate(`/admin/workers/${worker._id}`)} className="p-3 bg-gray-100 rounded-xl hover:bg-blue-600 hover:text-white transition group-hover:scale-105 active:scale-90"> <Edit size={16} /> </button>
                                            <button onClick={() => handleDelete(worker._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition group-hover:scale-105 active:scale-90"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Component - Scrollable */}
            <div className="flex justify-center mt-10">
                <div className="flex overflow-x-auto no-scrollbar gap-2 max-w-full pb-4 px-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => setPage(i + 1)}
                            className={`flex-shrink-0 w-12 h-12 rounded-[20px] font-black text-sm shadow-xl transition transform active:scale-95
                            ${page === i + 1 ? 'bg-green-700 text-white rotate-6' : 'bg-white text-gray-400'}`}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageWorkers;