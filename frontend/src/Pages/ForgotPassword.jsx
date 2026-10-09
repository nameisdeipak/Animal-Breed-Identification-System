import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const forgotPwdSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPwdSchema)
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axiosClient.post("/auth/forgot-password", data);
      console.log(response.data);
      setSent(true);
    } catch (err) {
      console.log(err)
      alert("Failed to send link. Email check karo!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl">
 
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-700 font-bold mb-8 hover:translate-x-1 transition cursor-pointer"
        > <ArrowLeft size={18} /> Go Back
        </button>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Check Your Inbox!</h2>
            <p className="text-gray-500 mt-2">Humne password reset link aapke email par bhej diya hai.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900 leading-tight">Forgot Your <span className="text-green-700">Security Key?</span></h2>
            <p className="text-gray-500 font-medium">Koi baat nahi bro! Apna email dalo, hum ek recovery link bhej denge.</p>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("email")}
                placeholder="Email Address"
                className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-600 transition"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2 ml-2">{errors.email.message}</p>}
            </div>

            <button className="w-full bg-green-700 hover:bg-green-800 text-white font-black py-4 rounded-2xl shadow-xl transition active:scale-95">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;