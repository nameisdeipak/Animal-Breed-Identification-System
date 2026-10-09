import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF0]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-8">
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">AI for Indian Dairy</span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
            Revolutionizing <br/>
            <span className="text-green-700">Breed Identity</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Register your livestock with 99% accuracy. Using advanced AI to help FLWs identify and manage Indian cattle breeds instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="bg-green-700 text-center text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-800 shadow-xl transition transform hover:-translate-y-1">Get Started</Link>
            <div className="flex items-center gap-3 px-6 py-4 border-2 border-gray-200 rounded-2xl">
              <span className="text-gray-900 font-bold underline cursor-pointer">Learn How AI works</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          <img 
            src="https://img.freepik.com/free-photo/view-cow-nature-environment_23-2150392358.jpg?t=st=1715668383~exp=1715671983~hmac=565ec2e5c8793b5a9390231571434c449be90b6edb8c4c360c70e28421b4a92c&w=1380" 
            alt="Cow Hero" 
            className="rounded-[40px] shadow-2xl rotate-2 hover:rotate-0 transition duration-500 border-8 border-white"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;