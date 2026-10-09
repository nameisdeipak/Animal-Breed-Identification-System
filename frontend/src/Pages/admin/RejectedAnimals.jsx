import React, { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import toast from "react-hot-toast";
import { RefreshCcw, User, MapPin, Info } from "lucide-react";

const RejectedAnimals = () => {
  const [rejectedItems, setRejectedItems] = useState([]);

  useEffect(() => { fetchRejected(); }, []);

  const fetchRejected = async () => {
    try {
      const res = await axiosClient.get("/admin/rejected-animals");
      setRejectedItems(res.data);
    } catch (err) { toast.error("Error fetching data"); }
  };

  const moveToPending = async (id) => {
      try {
          await axiosClient.put(`/admin/recheck-animal/${id}`, { status: "pending" });
          toast.success("Moved back to Review Queue!");
          setRejectedItems(rejectedItems.filter(i => i._id !== id));
      } catch (err) { toast.error("Re-review failed"); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="border-l-8 border-red-500 pl-4">
          <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Rejected Repository</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Logs marked as invalid or incorrect data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-grayscale grayscale hover:grayscale-0 transition-all duration-700">
        {rejectedItems.map(item => (
          <div key={item._id} className="bg-white rounded-[45px] shadow-2xl border border-red-50 overflow-hidden opacity-90 hover:opacity-100 group">
             <div className="h-52 relative">
                <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition" />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Invalid Record</div>
             </div>

             <div className="p-8">
                <h3 className="text-2xl font-black text-gray-800 uppercase italic">{item.confirmedBreed}</h3>
                <div className="mt-4 space-y-1 pb-6 border-b border-gray-100">
                   <p className="text-xs font-bold text-gray-400 flex items-center gap-2 underline decoration-red-100 underline-offset-4"> <User size={14}/> Rejected from: {item.uploadedBy?.fullName}</p>
                   <p className="text-xs font-medium text-gray-400 flex items-center gap-2 italic"> <Info size={14}/> Reason: {item.notes || "Data mismatch/low clarity"}</p>
                </div>

                <button 
                   onClick={() => moveToPending(item._id)}
                   className="w-full mt-6 bg-gray-900 text-white font-black py-4 rounded-3xl hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                   <RefreshCcw size={18}/> Re-check Record
                </button>
             </div>
          </div>
        ))}
      </div>

      {rejectedItems.length === 0 && <p className="text-center p-20 font-black text-gray-200 uppercase tracking-widest">Repository is Empty.</p>}
    </div>
  );
};

export default RejectedAnimals;