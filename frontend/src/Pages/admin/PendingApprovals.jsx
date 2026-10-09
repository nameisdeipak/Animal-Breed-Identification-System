import React, { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import toast from "react-hot-toast";

const PendingApprovals = () => {
    const [animals, setAnimals] = useState([]);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        const res = await axiosClient.get("/admin/pending-approvals");
        setAnimals(res.data);
    };

    const handleAction = async (id, status) => {
        try {
            await axiosClient.put(`/admin/verify-animal/${id}`, { status });
            toast.success(`Marked as ${status}`);
            fetchPending();
        } catch (err) { toast.error("Action failed"); }
    };

    return (
        <div className="p-10 space-y-8">
            <h2 className="text-2xl font-black text-green-900 border-l-8 border-orange-500 pl-4 uppercase italic">Waiting for Approval</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {animals.map(item => (
                    <div key={item._id} className="bg-white rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden group">
                        <img src={item.imageUrl} className="h-56 w-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="p-8">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.animalType}</p>
                            <h3 className="text-2xl font-black text-gray-800 italic uppercase">{item.confirmedBreed}</h3>
                            <div className="mt-4 pt-4 border-t border-gray-50 space-y-1">
                                <p className="text-xs text-gray-600 font-bold uppercase">Collector: {item.uploadedBy.fullName}</p>
                                <p className="text-xs text-gray-400 font-medium">Confidence Score: {item.confidenceScore}%</p>
                            </div>
                            
                            <div className="mt-8 flex gap-3">
                                <button onClick={() => handleAction(item._id, "verified")} className="flex-1 bg-green-700 text-white font-black py-3 rounded-2xl hover:bg-green-800 transition">APPROVE</button>
                                <button onClick={() => handleAction(item._id, "rejected")} className="flex-1 border border-red-100 text-red-600 font-black py-3 rounded-2xl hover:bg-red-50">REJECT</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {animals.length === 0 && <p className="p-20 text-center font-bold text-gray-300">Clean desk! No pending requests.</p>}
        </div>
    );
};

export default PendingApprovals;