import React , {useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { registerSchema } from '../utils/formSchemas';
import { z } from "zod";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../Slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Loader2, Building, ShieldCheck ,Eye,EyeOff} from 'lucide-react';


const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().regex(/^\+[1-9]\d{7,14}$/, "Use format +91XXXXXXXXXX"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  village: z.string().min(1, "Village is required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data) => {
    dispatch(registerUser(data)).then((res) => {
       if (res.payload?.user) navigate('/dashboard');
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-2xl p-8 md:p-12">
        <header className="mb-10 text-center">
          <span className="text-green-700 font-medium tracking-[4px] uppercase text-xs">Official Portal</span>
          <h2 className="text-4xl font-medium text-gray-900 mt-2">Registration Form</h2>
          <p className="text-gray-500 font-medium">Become a Field Level Worker (FLW) today.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Field: Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 h-5 w-5" />
                <input {...register("fullName")} placeholder="John Doe" className="w-full bg-green-50/50 border-0 rounded-2xl py-3.5 pl-12" />
              </div>
              {errors.fullName && <span className="text-red-500 text-[10px] ml-2 font-bold">{errors.fullName.message}</span>}
            </div>

            {/* Field: Email */}
            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Email</label>
               <input {...register("email")} className="w-full bg-green-50/50 border-0 rounded-2xl py-3.5 px-4" placeholder="example@email.com" />
               {errors.email && <span className="text-red-500 text-[10px] ml-2 font-bold">{errors.email.message}</span>}
            </div>

            {/* Field: Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Phone (with +91)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 h-5 w-5" />
                <input {...register("phoneNumber")} placeholder="+919876543210" className="w-full bg-green-50/50 border-0 rounded-2xl py-3.5 pl-12" />
              </div>
              {errors.phoneNumber && <span className="text-red-500 text-[10px] ml-2 font-bold">{errors.phoneNumber.message}</span>}
            </div>

      
            {/* Address Grid */}
            <div className="space-y-1">
               <label className="text-xs font-bold  uppercase ml-1 tracking-wider text-green-700  flex items-center gap-1"> <MapPin size={12}/> Region Selection</label>
               <div className="grid grid-cols-3 gap-2">
                 <input {...register("village")} placeholder="Village" className="w-full bg-gray-50 border-0 rounded-xl py-3 px-3 text-sm font-medium" />
                 <input {...register("district")} placeholder="District" className="w-full bg-gray-50 border-0 rounded-xl py-3 px-3 text-sm font-medium" />
                 <input {...register("state")} placeholder="State" className="w-full bg-gray-50 border-0 rounded-xl py-3 px-3 text-sm font-medium" />
               </div>
            </div>

            {/* Password */}
            <div className="space-y-1 relative">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Secret Key (Password)</label>
               <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-green-50/50 border-0 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-green-600 shadow-inner" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className=" absolute right-4 top-[3rem] -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
               {errors.password && <span className="text-red-500 text-[10px] ml-2 font-bold">{errors.password.message}</span>}
            </div>

          </div>

          <div className="pt-4">
             <button disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-4 rounded-[20px] transition transform active:scale-95 shadow-xl shadow-orange-100 uppercase tracking-widest flex items-center justify-center gap-3">
               {loading ? <Loader2 className="animate-spin"/> : <>Secure Register <ShieldCheck size={20}/></>}
             </button>
          </div>
        </form>

        <p className="mt-8 text-center text-gray-600 font-semibold tracking-wide">
          Already an officer? <Link to="/login" className="text-green-700 underline underline-offset-4 decoration-2 decoration-green-200">System Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;










