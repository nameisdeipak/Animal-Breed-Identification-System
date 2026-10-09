

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import RegistrationTable from "../components/RegistrationTable"

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalRegistered: 0,
    pendingVerification: 0,
    recentPredictions: 0,
    efficiencyScore: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get("/animal/stats");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header logic same hi rahega */}
      <header className="flex justify-between items-center max-md:flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Hello, {user?.fullName}! 👋</h2>
          <p className="text-gray-500 font-medium">Region: {user?.village}, {user?.district}</p>
        </div>
        <Link to="/register-animal" className="bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-sm hover:bg-orange-700 transition flex items-center gap-2 shadow-xl shadow-orange-100">
           New Registration
        </Link>
      </header>

      {/* Analytics Summary - NOW DYNAMIC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Registered", value: stats.totalRegistered, icon: "🐄", color: "bg-blue-50 text-blue-600" },
          { label: "Pending Review", value: stats.pendingVerification, icon: "⏳", color: "bg-amber-50 text-amber-600" },
          { label: "AI Analysis done", value: stats.recentPredictions, icon: "✨", color: "bg-green-50 text-green-600" },
        ].map((item, index) => (
          <div key={index} className="bg-white p-8 rounded-[32px] border border-green-50 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition`}>
              {item.icon}
            </div>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{item.label}</p>
            <h3 className="text-4xl font-black mt-1 text-gray-900">{item.value}</h3>
          </div>
        ))}
      </div>

      <RegistrationTable/>
      {/* Hero Banner logic stays the same but keep it stylish */}
      <div className="bg-green-800 rounded-[40px] p-8 md:p-14 text-white relative overflow-hidden group">
         <div className="relative z-10 space-y-6">
            <h3 className="text-4xl font-black max-w-sm italic">Analyze Livestock Accuracy 99.8%</h3>
            <p className="text-green-100/70 max-w-md font-medium">Use the AI Scanner to avoid human error in breed registration. Proper data leads to better Govt. subsidies for farmers.</p>
            <Link to="/register-animal" className="inline-block bg-white text-green-900 px-10 py-4 rounded-full font-black text-lg hover:bg-orange-500 hover:text-white transition transform active:scale-95 shadow-2xl">
               Start Scan
            </Link>
         </div>
         {/* Simple background decorative circle */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-green-700/50 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

    </div>
  );
};

export default Dashboard;