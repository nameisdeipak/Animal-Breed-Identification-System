const Animal = require("../models/Animal");
const Breed = require("../models/Breed");
const Prediction = require("../models/Prediction");
const axios = require("axios");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Notification = require("../models/Notification");

const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id; 

    // 1. Total Cattle Registered by this user
    const totalRegistered = await Animal.countDocuments({ uploadedBy: userId });

    // 2. Pending Verification (Status: pending)
    const pendingVerification = await Animal.countDocuments({
      uploadedBy: userId,
      registrationStatus: "pending",
    });

    // 3. Verified Cattles (for Efficiency Score)
    const verifiedCount = await Animal.countDocuments({
      uploadedBy: userId,
      registrationStatus: "verified",
    });

    // 4. Efficiency Score calculate karna (Simple formula)
    const efficiencyScore =
      totalRegistered > 0
        ? ((verifiedCount / totalRegistered) * 100).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalRegistered,
        pendingVerification,
        recentPredictions: totalRegistered, // Jitne animals register huye utne prediction hue
        efficiencyScore,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getMyRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const userId = req.user._id;

    // Search query: Breed, Owner Name ya Village 
    const query = {
      uploadedBy: userId,
      $or: [
        { confirmedBreed: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
        { village: { $regex: search, $options: "i" } },
      ],
    };

    const registrations = await Animal.find(query)
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Animal.countDocuments(query);

    res.json({
      success: true,
      registrations,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEntries: count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Animal Details
const updateAnimalDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const animal = await Animal.findByIdAndUpdate(id, updatedData, {
      returnDocument: "after",
    });
    res.status(200).json({ success: true, message: "Details Updated", animal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registrationAnimalWithAI = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image upload fail ho gayi!" });

    // 1. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "animal_breeds",
    });
    const imageUrl = result.secure_url;

    // 2. Python AI Server ko request bhejo 
    try {
      const aiResponse = await axios.post("http://localhost:5000/predict", {
        imageUrl: imageUrl,
      });

      // 3. Return results back to Frontend
      res.status(200).json({
        success: true,
        imageUrl: imageUrl,
        breed: aiResponse.data.breed,
        confidence: aiResponse.data.confidence,
        origin: aiResponse.data.origin,
        milkAvg: aiResponse.data.milk,
      });
    } catch (aiErr) {
      console.error("AI Server Error:", aiErr.message);
      res.status(502).json({ message: "AI server down hai, try later" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitFinalAnimalRegistration = async (req, res) => {
  try {
    const {
      animalType,
      ownerName,
      ownerPhone,
      village,
      district,
      state,
      age,
      milkCapacity,
      imageUrl,
      aiDetectedBreed,
      confidence,
    } = req.body;

    // 1. Pelhe "Breed" collection se asali ID dhoondho (e.g. "Gir")
    let breedDoc = await Breed.findOne({ breedName: aiDetectedBreed });

    // Agar Breed pehle se DB mein nahi hai, toh ek temporary create kar lo (optional)
    if (!breedDoc) {
      breedDoc = await Breed.create({
        breedName: aiDetectedBreed,
        animalType: animalType,
      });
    }

    // 2. Animal Collection Create Karo
    const newAnimal = await Animal.create({
      animalType,
      predictedBreed: breedDoc._id, // Store ID here
      confirmedBreed: aiDetectedBreed,
      imageUrl,
      ownerName,
      ownerPhone,
      village,
      district,
      state,
      age,
      milkCapacityPerDay: milkCapacity,
      uploadedBy: req.user._id,
      confidenceScore: confidence,
      registrationStatus: "pending",
    });

    await Prediction.create({
      animal: newAnimal._id,
      predictedBreed: breedDoc._id,
      confidenceScore: confidence,
      aiModelVersion: "v1",
    });

    await Notification.create({
    message: `New ${animalType} registration from ${village} by ${req.user.fullName}`,
    type: "new_registration",
    linkId: newAnimal._id
});

    res.status(201).json({
      success: true,
      message: "Data populated across all collections!",
      animal: newAnimal,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;
    // .populate hum isliye kar rahe hain taaki admin ko pata chale kisne upload kiya
    const animal = await Animal.findById(id).populate("uploadedBy", "fullName email");

    if (!animal) {
      return res.status(404).json({ success: false, message: "Animal not found" });
    }

    res.status(200).json({ success: true, animal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUserStats,
  getMyRegistrations,
  updateAnimalDetails,
  registrationAnimalWithAI,
  submitFinalAnimalRegistration,
  getAnimalById
};
