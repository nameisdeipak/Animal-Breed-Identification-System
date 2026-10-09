import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { Lock, ShieldCheck, Eye, EyeOff, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate , Link } from "react-router-dom";

const changePwdSchema = z.object({
  oldPassword: z.string().min(1, "Current password zaruri hai"),
  newPassword: z.string().min(6, "Password kam se kam 6 digits ka ho"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Confirm Password match nahi ho raha",
  path: ["confirmPassword"],
});

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState({ old: false, new: false, conf: false });

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(changePwdSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await axiosClient.put("/auth/change-password", data);
            toast.success(res.data.message);
            reset(); // Clear form after success
        } catch (err) {
            toast.error(err.response?.data?.message || "Password badalne me galti hui");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-green-50 flex flex-col md:flex-row">
                
                {/* Visual Branding Section */}
                <div className="md:w-5/12 bg-green-950 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="z-10">
                        <h2 className="text-4xl font-black italic leading-none mb-4">Master <br/><span className="text-orange-500">Security</span> Key</h2>
                        <p className="text-green-100/60 font-medium text-sm">Apna portal password regularly badalne se aapka data safe rehta hai.</p>
                    </div>
                    
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10 z-10">
                        <p className="text-xs font-black uppercase tracking-widest text-green-400 mb-2 italic">Guidelines:</p>
                        <ul className="text-[10px] space-y-2 font-bold opacity-80 uppercase tracking-tight">
                            <li>• Minimum 6 characters zaruri hain</li>
                            <li>• Don't use village name in password</li>
                            <li>• Alpha-numeric format best rehta hai</li>
                        </ul>
                    </div>

                    {/* Decor Circle */}
                    <div className="absolute -bottom-20 -left-20 w-60 h-64 bg-orange-600 rounded-full blur-[80px] opacity-20"></div>
                </div>

                {/* Actual Form */}
                <div className="md:w-7/12 p-8 md:p-14 bg-white">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                             <button type="button" onClick={()=>navigate(-1)} className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-green-800 transition"><ArrowLeft size={16}/> Go Back</button>
                             <ShieldCheck className="text-green-700" size={30}/>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8 underline decoration-green-100 underline-offset-8 italic">Synchronize Access</h3>

                        <PasswordField label="Old Secret Password" placeholder="Current Key" 
                          reg={register("oldPassword")} err={errors.oldPassword} 
                          visible={showPass.old} toggle={()=>setShowPass({...showPass, old: !showPass.old})} />

                        <PasswordField label="Define New Security Key" placeholder="New Strong Password" 
                          reg={register("newPassword")} err={errors.newPassword} 
                          visible={showPass.new} toggle={()=>setShowPass({...showPass, new: !showPass.new})} />

                        <PasswordField label="Confirm Your Identity Key" placeholder="Verify New Password" 
                          reg={register("confirmPassword")} err={errors.confirmPassword} 
                          visible={showPass.conf} toggle={()=>setShowPass({...showPass, conf: !showPass.conf})} />

                           <Link to="/forgot-password" className="flex items-center gap-3 px-6 py-1 text-[11px] font-black text-gray-600   hover:underline rounded-2xl transition uppercase tracking-widest"> Forgot Password</Link>

                        <button 
                            disabled={loading} 
                            type="submit" 
                            className="w-full bg-orange-600 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl transition transform active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest mt-10"
                        >
                            {loading ? <Loader2 className="animate-spin"/> : <><KeyRound size={18}/> Update System Keys</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Mini Component for Inputs
const PasswordField = ({ label, placeholder, reg, err, visible, toggle }) => (
    <div className="space-y-1 group">
        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest group-hover:text-green-700 transition"> {label}</label>
        <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
            <input 
                type={visible ? "text" : "password"}
                {...reg}
                placeholder={placeholder}
                className="w-full bg-gray-50 border-0 ring-2 ring-transparent focus:ring-green-600 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-gray-900 placeholder:text-gray-300 transition" 
            />
            <button 
                type="button" onClick={toggle} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 transition"
            >
                {visible ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
        </div>
        {err && <p className="text-[10px] font-black text-red-500 ml-3 italic">{err.message}</p>}
    </div>
);

export default ChangePassword;