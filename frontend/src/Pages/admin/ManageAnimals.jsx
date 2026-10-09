import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { Search, Trash2, Edit, ExternalLink, ChevronRight, Filter, Loader2, Footprints } from "lucide-react";
import toast from "react-hot-toast";

const ManageAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchAllAnimals(); }, [page, search]);

  const fetchAllAnimals = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/admin/all-animals?page=${page}&limit=10&search=${search}`);
      setAnimals(res.data.animals);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Koshish bhi mat karna bina soche! Data permanently udd jayega. Confirm?")) return;
    try {
      await axiosClient.delete(`/admin/delete-animal/${id}`);
      toast.success("Record Evicted!");
      fetchAllAnimals();
    } catch (err) { toast.error("Eror deleting"); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="border-l-8 border-orange-600 pl-4">
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Central Registry</h2>
           <p className="text-xs font-bold text-gray-400">Inventory of all livestock entries in the system</p>
        </div>

        <div className="bg-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-green-50 w-full md:w-96">
            <Search className="text-gray-300" size={20}/>
            <input 
              value={search} onChange={(e) => {setSearch(e.target.value); setPage(1)}}
              placeholder="Quick search tags..." className="flex-1 bg-transparent border-none outline-none font-medium text-sm text-gray-600" />
        </div>
      </div>

      {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-green-700" size={40}/></div> : (
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-green-50 mx-1">
             <table className="w-full text-left">
                <thead className="hidden lg:table-header-group bg-gray-50 border-b border-gray-100 font-black text-[10px] text-gray-400 tracking-[3px] uppercase">
                    <tr>
                        <th className="px-10 py-6">Identity Tag</th>
                        <th className="px-6 py-6">Specifications</th>
                        <th className="px-6 py-6">Worker/Source</th>
                        <th className="px-6 py-6">Approval</th>
                        <th className="px-8 py-6">Actions</th>
                    </tr>
                </thead>

                <tbody className="flex flex-col lg:table-row-group divide-y divide-gray-100">
                   {animals.map((item) => (
                      <tr key={item._id} className="flex flex-col lg:table-row group hover:bg-green-50/40 transition">
                         {/* Cell 1: Image & Name */}
                         <td className="px-8 lg:px-10 py-6 flex justify-between lg:table-cell items-center">
                            <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase">Livestock</span>
                            <div className="flex items-center gap-4 text-right lg:text-left">
                                <img src={item.imageUrl} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-100 group-hover:ring-orange-200 transition" />
                                <div>
                                   <p className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">{item.confirmedBreed}</p>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase">{item.animalType}</p>
                                </div>
                            </div>
                         </td>

                         {/* Cell 2: Details */}
                         <td className="px-8 py-4 lg:py-6 lg:table-cell flex justify-between items-center border-t lg:border-none">
                             <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase">Physical Stats</span>
                             <div className="text-right lg:text-left">
                                 <p className="text-sm font-bold text-gray-800">{item.ownerName} <span className="text-[10px] font-medium opacity-50 block">{item.village}</span></p>
                                 <p className="text-[11px] text-green-700 font-bold italic mt-1 uppercase">Daily: {item.milkCapacityPerDay} L / Age: {item.age} Y</p>
                             </div>
                         </td>

                         {/* Cell 3: Worker Source */}
                         <td className="px-8 py-4 lg:py-6 lg:table-cell flex justify-between items-center border-t lg:border-none">
                            <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase">FLW ID</span>
                            <div className="text-right lg:text-left bg-gray-50 lg:bg-transparent p-2 lg:p-0 rounded-xl">
                               <p className="text-xs font-black text-gray-700 leading-none">By: {item.uploadedBy?.fullName || "Auto System"}</p>
                               <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase underline underline-offset-4 tracking-tighter italic decoration-gray-100">CONF: {item.confidenceScore}%</p>
                            </div>
                         </td>

                         {/* Cell 4: Verification */}
                         <td className="px-8 py-4 lg:py-6 lg:table-cell flex justify-between items-center border-t lg:border-none">
                             <span className="lg:hidden text-[10px] font-black text-gray-300 uppercase">Process Status</span>
                             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider 
                                ${item.registrationStatus === 'verified' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                                 {item.registrationStatus}
                             </div>
                         </td>

                         {/* Cell 5: Actions */}
                         <td className="px-8 py-6 lg:table-cell border-t lg:border-none">
                            <div className="flex gap-4 justify-end lg:justify-start">
                               {/* Navigate to detail page for editing */}
                               <button onClick={() => navigate(`/admin/animal-details/${item._id}`)} className="p-3 bg-gray-50 rounded-2xl hover:bg-green-700 hover:text-white transition group-hover:scale-110 active:scale-95 shadow-sm border border-gray-100"><Edit size={16}/></button>
                               <button onClick={() => handleDelete(item._id)} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition group-hover:scale-110 active:scale-95 shadow-sm border border-red-100"><Trash2 size={16}/></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
      )}

      {/* Pagination Bar - Earthy Scrollable */}
      <div className="flex justify-center items-center py-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar p-2">
            {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} onClick={() => setPage(i + 1)}
                  className={`flex-shrink-0 w-14 h-14 rounded-3xl font-black text-sm transition transform hover:rotate-6 active:scale-95 shadow-xl
                    ${page === i+1 ? 'bg-orange-600 text-white shadow-orange-100' : 'bg-white text-gray-400'}`}
                >
                    {i+1}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageAnimals;