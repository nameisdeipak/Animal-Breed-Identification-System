const express = require("express");
const adminRoute = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Animal = require("../models/Animal");
const User = require("../models/User");
const { getStats,   
     pendingApprovels, 
        verifiyAnimal,  
          getRejectedAnimals,
    getAllWorkers, 
    recheckRejectedAnimal ,
    toggleWorkerStatus,
    deleteWorker,getAllAnimalsAdmin
,
    adminDeleteAnimal,
    updateUserByAdmin
    ,getUserByIdAdmin,
    getAdminNotifications,
    markAsRead
}=require("../controllers/adminController");


adminRoute.get("/global-stats", userMiddleware, adminMiddleware,getStats);
adminRoute.get("/pending-approvals", userMiddleware, adminMiddleware, pendingApprovels);
adminRoute.put("/verify-animal/:id", userMiddleware, adminMiddleware,verifiyAnimal );
adminRoute.get('/rejected-animals', userMiddleware, adminMiddleware, getRejectedAnimals);
adminRoute.get('/all-workers', userMiddleware, adminMiddleware, getAllWorkers);
adminRoute.put('/recheck-animal/:id', userMiddleware, adminMiddleware, recheckRejectedAnimal);

adminRoute.patch("/worker-status/:id", userMiddleware, adminMiddleware, toggleWorkerStatus);
adminRoute.delete("/delete-worker/:id", userMiddleware, adminMiddleware, deleteWorker);

adminRoute.get("/all-animals", userMiddleware, adminMiddleware, getAllAnimalsAdmin);
adminRoute.delete("/delete-animal/:id", userMiddleware, adminMiddleware, adminDeleteAnimal);

adminRoute.put("/update-user-status", userMiddleware, adminMiddleware, updateUserByAdmin);

adminRoute.get("/worker/:id", userMiddleware, adminMiddleware, getUserByIdAdmin);

adminRoute.get("/notifications", userMiddleware, adminMiddleware, getAdminNotifications);
adminRoute.put("/read-all", userMiddleware, adminMiddleware, markAsRead);

module.exports = adminRoute;