import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { ShieldCheck, Users, Clock, PlusCircle } from "lucide-react";

const AdminHome = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axiosClient.get("/admin/global-stats").then(res => setStats(res.data));
  }, []);

  return (
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-end">
         <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter">Central Control <br/><span className="text-orange-600 tracking-normal">Administration</span></h1>
      </header>

      {/* Admin Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<PlusCircle/>} label="Total Reg." value={stats.totalCattles} color="bg-green-700" />
        <StatCard icon={<Clock/>} label="Pending Approval" value={stats.pending} color="bg-orange-500" />
        <StatCard icon={<ShieldCheck/>} label="Verified Logs" value={stats.totalVerified} color="bg-blue-600" />
        <StatCard icon={<Users/>} label="Total FLWs" value={stats.totalWorkers} color="bg-indigo-600" />
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 text-center border-dashed">
         <img src="https://cdn-icons-png.flaticon.com/512/3649/3649255.png" className="w-20 mx-auto grayscale mb-4" />
         <h3 className="font-bold text-gray-400">Main Console: Start verifying records from Approval tab</h3>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={`${color} p-8 rounded-[40px] text-white shadow-xl transition hover:-translate-y-2`}>
        <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">{icon}</div>
        <p className="text-[10px] uppercase font-black tracking-widest opacity-60">{label}</p>
        <h4 className="text-4xl font-black">{value || 0}</h4>
    </div>
);

export default AdminHome;