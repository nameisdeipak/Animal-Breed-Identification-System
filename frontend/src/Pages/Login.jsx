import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight ,EyeOff,Eye } from 'lucide-react';


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data)).then((res) => {
      if (res.payload?.user) navigate('/dashboard');
    });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-[#FDFCF0]">
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left Side: Aesthetic Image */}
        <div className="md:w-1/2 bg-green-800 relative p-12 text-white flex flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold leading-tight">Identify Breeds <br /> with Confidence.</h2>
            <p className="mt-4 text-green-100  text-lg font-light tracking-wide ">"Precision in every registration, empowering every farmer."</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            className="absolute bottom-0 left-0 w-full opacity-30 object-cover"
            alt="Cow Background"
          />
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16">
          <div className="mb-10">
            <h3 className="text-3xl font-medium text-gray-900 tracking-tight">Welcome Back</h3>
            <p className="text-gray-500 font-medium">Please enter your credentials to login.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register("email")}
                  placeholder="name@company.com"
                  className="w-full bg-gray-50 border-none ring-2 ring-transparent focus:ring-green-600 rounded-2xl py-4 pl-12 pr-4 transition duration-300"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-medium ml-2">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-none ring-2 ring-transparent focus:ring-green-600 rounded-2xl py-4 pl-12 pr-4 transition duration-300"
                />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700 transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-medium ml-2">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Login to System <ArrowRight className="group-hover:translate-x-1 transition" /></>}
            </button>
            {error && <p className="text-center text-red-500 font-bold">{error}</p>}
            <Link to="/forgot-password" className="text-green-700 font-bold hover:underline">Forgot Password</Link>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            New here? <Link to="/register" className="text-orange-600 font-bold hover:underline ">Create Worker Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


