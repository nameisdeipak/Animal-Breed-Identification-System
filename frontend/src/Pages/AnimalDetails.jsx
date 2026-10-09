import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { ArrowLeft, Briefcase,Phone,Mail,Save, Edit2, MapPin, User, Milk, Calendar, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const AnimalDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
      const { user } = useSelector((state) => state.auth);


    useEffect(() => {
    setLoading(true);
    axiosClient.get(`/animal/details/${id}`) 
        .then(res => {
            if (res.data.success) {
                setData(res.data.animal);
                console.log(res.data.animal)
            }
        })
        .catch(err => {
            toast.error("Not Find this Record in Database");
            console.error(err);
        })
        .finally(() => setLoading(false));
}, [id]);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await axiosClient.put(`/animal/update-animal/${id}`, data);
            toast.success("Record Sync Ho Gaya!");
            setEditMode(false);
        } catch (err) { toast.error("Update failed"); }
        finally { setLoading(false); }
    };

    if (!data) return <div className="p-20 text-center font-bold">Loading Data...</div>;

    return (
        <div className="min-h-screen bg-[#FDFCF0] p-4 md:p-10 pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 font-bold text-green-800 hover:scale-105 transition">
                <ArrowLeft size={20}/> Back to Dashboard
            </button>

            <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-green-50">
                <div className="flex flex-col lg:flex-row">
                    {/* Left: Image Card */}
                    <div className="lg:w-1/2 relative h-96 lg:h-auto">
                        <img src={data.imageUrl} className="w-full h-full object-cover" />
                        <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl text-white font-bold uppercase tracking-widest text-xs">
                             Live Preview
                        </div>
                    </div>

                    {/* Right: Info Section */}
                    <div className="lg:w-1/2 p-8 md:p-12 space-y-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 italic uppercase">{data.confirmedBreed}</h1>
                                <p className="text-green-700 font-bold uppercase text-[10px] tracking-[4px] mt-2">{data.animalType} Registration</p>
                            </div>
                            <button onClick={() => editMode ? handleUpdate() : setEditMode(true)} className={`${editMode ? 'bg-orange-600' : 'bg-green-700'} text-white p-4 rounded-2xl shadow-xl transition active:scale-95`}>
                                {loading ? "..." : editMode ? <Save size={22}/> : <Edit2 size={22}/>}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 border-t pt-8 border-gray-100">
                             <DetailItem edit={editMode} label="Farmer Name" icon={<User size={18}/>} value={data.ownerName} 
                                onChange={(val) => setData({...data, ownerName: val})} />
                             <DetailItem edit={editMode} label="Contact" icon={<Phone size={18}/>} value={data.ownerPhone} 
                                onChange={(val) => setData({...data, ownerPhone: val})} />
                             <DetailItem edit={editMode} label="Village" icon={<MapPin size={18}/>} value={data.village} 
                                onChange={(val) => setData({...data, village: val})} />
                             <DetailItem label="Breed Confidence" icon={<ShieldCheck size={18}/>} value={data.confidenceScore + "% Match"} noEdit />
                             <DetailItem edit={editMode} label="Age" icon={<Calendar size={18}/>} value={data.age} 
                                onChange={(val) => setData({...data, age: val})} />
                             <DetailItem edit={editMode} label="Milk Prod/Day" icon={<Milk size={18}/>} value={data.milkCapacityPerDay} 
                                onChange={(val) => setData({...data, milkCapacityPerDay: val})} />

                              
                        </div>
                    </div>
                </div>
            </div>

                {user?.role === "admin" && (
                                <div className="col-span-2 grid grid-cols-2 gap-6 mt-4 pt-6 border-t border-dashed border-gray-200 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="col-span-2">
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-[4px] mb-4">Field Officer Details</p>
                                    </div>
                                    <DetailItem 
                                        label="Registered By" 
                                        icon={<Briefcase size={18} className="text-orange-500" />} 
                                        value={data.uploadedBy?.fullName || "System Auto"} 
                                        noEdit 
                                    />
                                    <DetailItem 
                                        label="Officer Email" 
                                        icon={<Mail size={18} className="text-orange-500" />} 
                                        value={data.uploadedBy?.email || "N/A"} 
                                        noEdit 
                                    />
                                </div>
                            )}
        </div>
    );
};

const DetailItem = ({ label, icon, value, edit, onChange, noEdit }) => (
    <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
            {icon} {label}
        </label>
        {edit && !noEdit ? (
            <input 
              value={value} 
              onChange={(e) => onChange(e.target.value)} 
              className="w-full bg-gray-50 border-0 rounded-xl py-2 px-3 text-sm font-bold text-green-900 outline-none ring-2 ring-transparent focus:ring-green-600"
            />
        ) : (
            <p className="text-base font-black text-gray-800">{value}</p>
        )}
    </div>
);



export default AnimalDetails;