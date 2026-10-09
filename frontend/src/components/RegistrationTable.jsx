import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { Search, ChevronRight, BadgeCheck, Clock, Loader2, ListChecks, ArrowLeft, ArrowRight } from "lucide-react";

const RegistrationTable = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, [page, search]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/animal/my-logs?page=${page}&limit=10&search=${search}`);
      setLogs(res.data.registrations);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const isToday = (dateString) => new Date(dateString).toDateString() === new Date().toDateString();

  const todayLogs = logs.filter(log => isToday(log.createdAt)).slice(0, 5); 
  const olderLogs = logs.filter(log => !isToday(log.createdAt));

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Dynamic Search Header */}
      <div className="bg-white p-4 rounded-[30px] shadow-2xl border border-green-50 flex items-center gap-4 mx-2">
        <Search className="text-gray-400 ml-4" />
        <input 
          placeholder="Search farmer, village or breed..." 
          className="flex-1 bg-transparent border-none outline-none font-medium text-gray-700 placeholder:text-gray-300"
          value={search}
          onChange={(e) => {setSearch(e.target.value); setPage(1);}}
        />
      </div>

      {/* 2. Today's Activity Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-6">
          <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
          <h2 className="text-2xl font-black text-green-900 tracking-tighter uppercase italic">Recently Registered (Today)</h2>
        </div>
        <ResponsiveTable data={todayLogs} loading={loading} onRowClick={(id) => navigate(`/animal-details/${id}`)} />
      </section>

      {/* 3. History History Table */}
      <section className="space-y-4 pt-10">
        <div className="flex items-center gap-3 px-6">
          <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
          <h2 className="text-2xl font-black text-gray-400 tracking-tighter uppercase italic opacity-60">Old Records History</h2>
        </div>
        <ResponsiveTable data={olderLogs} loading={loading} onRowClick={(id) => navigate(`/animal-details/${id}`)} />
      </section>

      {/* 4. Scrollable Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 px-4 py-8">
           <div className="flex overflow-x-auto gap-2 no-scrollbar p-2 max-w-[300px] md:max-w-full">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setPage(i + 1)}
                className={`flex-shrink-0 w-12 h-12 rounded-2xl font-black transition-all shadow-md 
                ${page === i + 1 ? 'bg-green-700 text-white scale-110 shadow-green-100' : 'bg-white text-gray-400 hover:bg-green-50'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Reusable Responsive Table Component ---
const ResponsiveTable = ({ data, loading, onRowClick }) => {
  if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-green-700" size={40}/></div>;
  if (data.length === 0) return <div className="text-center py-20 bg-white rounded-[40px] border border-dashed text-gray-300 font-bold italic mx-2 uppercase tracking-widest">Empty Dataset</div>;

  return (
    <div className="mx-2 overflow-hidden bg-white shadow-2xl rounded-[40px] border border-green-50">
      <table className="w-full text-left border-collapse">
        {/* Desktop Head */}
        <thead className="hidden md:table-header-group border-b border-gray-100">
          <tr className="text-[10px] uppercase font-black tracking-widest text-gray-400 italic">
            <th className="px-8 py-5">Livestock Preview</th>
            <th className="px-6 py-5">Breed & Species</th>
            <th className="px-6 py-5">Collector Info (Farmer)</th>
            <th className="px-6 py-5 text-center">AI Rank</th>
            <th className="px-6 py-5">Verify Status</th>
            <th className="px-8 py-5"></th>
          </tr>
        </thead>

        <tbody className="flex flex-col md:table-row-group">
          {data.map((item) => (
            <tr 
              key={item._id} 
              onClick={() => onRowClick(item._id)}
              className="flex flex-col md:table-row hover:bg-green-50 transition-colors border-b border-gray-50 last:border-none p-6 md:p-0 cursor-pointer"
            >
              {/* Image Cell */}
              <td className="md:px-8 md:py-6 flex justify-between items-center md:table-cell">
                <span className="md:hidden text-xs font-black text-gray-300 uppercase">Animal</span>
                <div className="w-20 h-20 md:w-16 md:h-16 rounded-[24px] bg-gray-100 overflow-hidden ring-4 ring-gray-50 shadow-inner">
                  <img src={item.imageUrl} className="w-full h-full object-cover" />
                </div>
              </td>

              {/* Breed Info Cell */}
              <td className="md:px-6 md:py-6 flex justify-between items-center md:table-cell py-3">
                <span className="md:hidden text-xs font-black text-gray-300 uppercase">Identify</span>
                <div>
                  <p className="text-lg md:text-sm font-black text-green-900 uppercase italic tracking-tighter leading-none">{item.confirmedBreed}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{item.animalType}</p>
                </div>
              </td>

              {/* Farmer Info Cell */}
              <td className="md:px-6 md:py-6 flex justify-between items-center md:table-cell py-3 border-t md:border-none mt-2 pt-4 md:mt-0 md:pt-0">
                <span className="md:hidden text-xs font-black text-gray-300 uppercase">Owner Details</span>
                <div className="text-right md:text-left">
                  <p className="font-bold text-gray-800 leading-none mb-1">{item.ownerName}</p>
                  <p className="text-xs text-orange-600 font-medium italic opacity-70 underline underline-offset-4">{item.village}</p>
                </div>
              </td>

              {/* AI Confidence Cell */}
              <td className="md:px-6 md:py-6 text-center md:table-cell flex justify-between items-center py-3">
                <span className="md:hidden text-xs font-black text-gray-300 uppercase">Match Score</span>
                <div className="px-3 py-1 bg-green-50 text-green-700 text-[11px] font-black rounded-full inline-block">
                  {item.confidenceScore}%
                </div>
              </td>

              {/* Verification Badge */}
              <td className="md:px-6 md:py-6 md:table-cell flex justify-between items-center py-3">
                <span className="md:hidden text-xs font-black text-gray-300 uppercase">Govt. Review</span>
                {item.registrationStatus === 'verified' ? (
                  <span className="bg-green-600 text-white text-[9px] px-2 py-1 rounded-lg uppercase font-black tracking-widest shadow-md">Verified</span>
                ) : (
                  <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-1 rounded-lg uppercase font-black tracking-widest border border-amber-200">Pending</span>
                )}
              </td>

              {/* Arrow Column */}
              <td className="hidden md:table-cell px-8 text-right">
                <div className="bg-gray-100 p-2 rounded-xl text-gray-400 hover:bg-green-700 hover:text-white transition inline-block">
                    <ChevronRight size={18} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationTable;