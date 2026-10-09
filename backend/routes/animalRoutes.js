const multer = require("multer");
const axios = require("axios");
const express = require("express");
const animalRoute = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const cloudinary = require("../config/cloudinary");
const upload = multer({ dest: "uploads/" });

const {
  getUserStats,
  getMyRegistrations,updateAnimalDetails,
  registrationAnimalWithAI,
  submitFinalAnimalRegistration,getAnimalById
} = require("../controllers/animalController");

animalRoute.get("/stats", userMiddleware, getUserStats);
animalRoute.get('/my-logs', userMiddleware, getMyRegistrations)
animalRoute.put('/update-animal/:id', userMiddleware, updateAnimalDetails);

animalRoute.post('/register-ai', userMiddleware, upload.single('image'),registrationAnimalWithAI );
animalRoute.post('/submit-animal', userMiddleware,  submitFinalAnimalRegistration);

animalRoute.get("/details/:id", userMiddleware, getAnimalById);

module.exports = animalRoute;
