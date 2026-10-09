import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { Lock } from "lucide-react";

const resetPwdSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPwdSchema)
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.put(`/auth/reset-password/${token}`, { password: data.password });
      alert("Password updated! Now Login.");
      navigate("/login");
    } catch (err) {
      alert("Link expire ho gaya hai!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#1b2b1d] p-10 rounded-[40px] shadow-2xl text-white">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-3xl font-black italic">Set New <br/><span className="text-green-500 underline underline-offset-8 decoration-4 italic">Credentials</span></h2>
          
          <div className="space-y-4">
             <input 
               {...register("password")}
               type="password"
               placeholder="New Secret Password" 
               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:bg-white/10 transition outline-none text-white"
             />
             {errors.password && <p className="text-red-400 text-xs text-left ml-2">{errors.password.message}</p>}

             <input 
               {...register("confirmPassword")}
               type="password"
               placeholder="Confirm New Password" 
               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:bg-white/10 transition outline-none text-white"
             />
             {errors.confirmPassword && <p className="text-red-400 text-xs text-left ml-2">{errors.confirmPassword.message}</p>}
          </div>

          <button className="w-full bg-white text-green-900 font-black py-4 rounded-2xl shadow-xl hover:bg-gray-100 transition">
             Update My Access
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;