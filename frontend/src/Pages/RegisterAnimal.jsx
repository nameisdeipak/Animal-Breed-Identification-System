import React, { useState } from "react";
import axiosClient from "../utils/axiosClient";
import { CloudUpload, ScanSearch, CheckCircle, Info, Sparkles, Send } from "lucide-react";
import toast from "react-hot-toast";

const RegisterAnimal = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [info, setInfo] = useState({
    ownerName: "", ownerPhone: "", age: "",
    milkCapacity: "", village: "", district: "", state: "", animalType: "cattle"
  });


  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
    setResult(null);
  };

  const uploadAndPredict = async () => {
    if (!file) return toast.error("Select photo!");
    setLoading(true);
    const formData = new FormData(); formData.append("image", file);

    try {
      const res = await axiosClient.post("/animal/register-ai", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      toast.success("AI Successfully detected!");
    } catch (error) {
      toast.error(error.response?.data?.message || "AI Analysis Error");
    } finally { setLoading(false); }
  };

  const finalSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...info,
        aiDetectedBreed: result.breed,
        imageUrl: result.imageUrl,
        confidence: result.confidence,
      };
      await axiosClient.post("/animal/submit-animal", payload);
      toast.success("Successfully Sent for Pending Approval!");
      // Reset after success
      setResult(null); setFile(null); setPreview(null);
    } catch (err) { toast.error("Submit Failed"); }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] p-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Step 1: Scan View */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-green-50 h-fit">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2"><ScanSearch className="text-orange-600" /> Livestock Scan</h2>
            <div className={`relative border-4 border-dashed rounded-[32px] h-72 flex flex-col items-center justify-center overflow-hidden 
                ${preview ? 'border-green-600' : 'border-gray-200 bg-gray-50'}`}>
              {preview ? <img src={preview} className="w-full h-full object-cover" /> : <CloudUpload size={40} className="text-gray-300" />}
              <input type="file" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <button onClick={uploadAndPredict} disabled={loading || !file} className="w-full mt-6 bg-green-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
              {loading ? "AI is Analyzing..." : <><Sparkles /> Run Breed ID</>}
            </button>
          </div>

          <div className="space-y-6">
            {result ? (
              <div className="bg-[#1b2b1d] p-10 rounded-[40px] text-white shadow-2xl border border-white/10 animate-in zoom-in-95 duration-500">
                <span className="bg-green-500 text-[10px] px-3 py-1 rounded-full uppercase font-black">AI Analysis Complete</span>
                <h3 className="text-6xl font-black mt-4 italic">{result.breed}</h3>
                <div className="mt-8 flex justify-between items-end border-t border-white/10 pt-6">
                  <div><p className="text-xs opacity-60">Accuracy Score</p><p className="text-2xl font-bold">{result.confidence}%</p></div>
                  <div className="text-right"><p className="text-xs opacity-60">Avg Milk Prod.</p><p className="text-2xl font-bold">{result.milkAvg}</p></div>
                </div>
              </div>
            ) : (
              <div className="h-72 border-2 border-dashed border-gray-300 rounded-[40px] flex items-center justify-center text-gray-400 font-bold bg-white/50">
                Waiting for AI identification...
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Collector Form */}
        {result && (
          <form onSubmit={finalSubmit} className="bg-white rounded-[40px] p-10 shadow-2xl border border-green-50 animate-in slide-in-from-bottom-10 duration-700">
            <h3 className="text-2xl font-black mb-8 italic flex items-center gap-2 underline decoration-green-600 underline-offset-8"> <Info /> Collect Animal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <input required placeholder="Farmer/Owner Name" className="bg-gray-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-green-600" onChange={e => setInfo({ ...info, ownerName: e.target.value })} />
              <input required placeholder="Phone Number" className="bg-gray-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-green-600" onChange={e => setInfo({ ...info, ownerPhone: e.target.value })} />
              <select
                value={info.animalType}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    animalType: e.target.value,
                  })
                }
                className="bg-gray-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-green-600"
              >
                <option value="cattle" defaultChecked>
                  Cattle
                </option>

                <option value="buffalo">
                  Buffalo
                </option>

              </select>
              <input required placeholder="Animal Age (Years)" type="number" className="bg-gray-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-green-600" onChange={e => setInfo({ ...info, age: e.target.value })} />
              <input required placeholder="Daily Milk (Liters)" type="number" className="bg-gray-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-green-600" onChange={e => setInfo({ ...info, milkCapacity: e.target.value })} />
              <input required placeholder="Village Name" value={info.village}
                onChange={(e) => setInfo({ ...info, village: e.target.value })}
                className="p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200" />

              <input required placeholder="District Name" value={info.district}
                onChange={(e) => setInfo({ ...info, district: e.target.value })}
                className="p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200" />
            </div>
            <button type="submit" className="mt-10 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl w-full md:w-fit px-12 shadow-xl shadow-orange-100 flex items-center gap-2">
              Submit To Dashboard <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterAnimal;





