const Animal = require("../models/Animal");
const User = require("../models/User");
const Notification = require("../models/Notification");
const MAIN_ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const getStats = async (req, res) => {
  try {
    const totalCattles = await Animal.countDocuments();
    const pending = await Animal.countDocuments({
      registrationStatus: "pending",
    });
    const totalWorkers = await User.countDocuments({ role: "flw" });
    const totalVerified = await Animal.countDocuments({
      registrationStatus: "verified",
    });

    res.json({ totalCattles, pending, totalWorkers, totalVerified });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const pendingApprovels = async (req, res) => {
  try {
    const pendingAnimals = await Animal.find({ registrationStatus: "pending" })
      .populate("uploadedBy", "fullName email") // Worker ki details bhi dikhegi
      .sort("-createdAt");
    res.json(pendingAnimals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifiyAnimal = async (req, res) => {
  try {
    const { status, notes } = req.body; // status: "verified" or "rejected"
    const animal = await Animal.findByIdAndUpdate(
      req.params.id,
      { registrationStatus: status, notes },
      { returnDocument: "after" },
    );
    res.json({ message: `Animal ${status} successfully`, animal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRejectedAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ registrationStatus: "rejected" })
      .populate("uploadedBy", "fullName email")
      .sort("-updatedAt");
    res.status(200).json(animals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const recheckRejectedAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body; // Admin koi note dena chahe toh (e.g., "Updated info received")

    // 1. Pehle check karo ki animal exist karta hai aur status 'rejected' hai
    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({ message: "Animal record not found" });
    }

    if (animal.registrationStatus !== "rejected") {
      return res.status(400).json({
        message: "Only rejected records can be moved to re-check queue.",
      });
    }

    // 2. Status update karke wapis 'pending' kar do
    animal.registrationStatus = "pending";

    // Purane rejection notes mein naya note append kar sakte hain ya replace
    animal.notes = notes
      ? `Re-check Request: ${notes}`
      : "Moved back to pending for re-evaluation";

    await animal.save();

    res.status(200).json({
      success: true,
      message: "Animal moved back to Pending list successfully",
      animal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllWorkers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const workers = await User.find({ _id: { $ne: req.user._id } })
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort("-createdAt");

    const workersWithStats = await Promise.all(
      workers.map(async (worker) => {
        const regCount = await Animal.countDocuments({
          uploadedBy: worker._id,
        });
        const verifiedCount = await Animal.countDocuments({
          uploadedBy: worker._id,
          registrationStatus: "verified",
        });

        return {
          ...worker._doc,
          totalRegistrations: regCount,
          efficiency:
            regCount > 0 ? ((verifiedCount / regCount) * 100).toFixed(1) : 0,
        };
      }),
    );

    const total = await User.countDocuments({ role: "flw" });

    res.status(200).json({
      workers: workersWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Toggle Worker Active Status
const toggleWorkerStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User Not Found" });

    // Check if target is Main Admin
    if (user.email === MAIN_ADMIN_EMAIL) {
      return res.status(403).json({
        message: "You have no Authority to change Administraction Status",
      });
    }

    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({
      message: `User is now ${user.isActive ? "Active" : "Blocked"}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Delete Worker
const deleteWorker = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ message: "User Not Found" });

    // Check if target is Main Admin
    if (targetUser.email === MAIN_ADMIN_EMAIL) {
      return res.status(403).json({
        message: "You have no authority to Delete Main Administration Account",
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Worker deleted successfully from system" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 1. Get All Animals (Admin View) - with Search & Pagination
const getAllAnimalsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { confirmedBreed: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
        { village: { $regex: search, $options: "i" } },
      ],
    };

    const animals = await Animal.find(query)
      .populate("uploadedBy", "fullName email") 
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Animal.countDocuments(query);

    res.status(200).json({
      animals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalEntries: total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Admin specific Animal Delete
const adminDeleteAnimal = async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Record deleted from central database" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 1. User ka Role ya Status update karne ke liye
const updateUserByAdmin = async (req, res) => {
  try {
    const { userId, newRole, isActive } = req.body;

    const targetUser = await User.findById(userId);

    if (!targetUser) return res.status(404).json({ message: "User Not Found" });

    // Check if target is Main Admin
    if (targetUser.email === MAIN_ADMIN_EMAIL) {
      return res.status(403).json({
        message: "You have no Authority to change Administration account Role",
      });
    }

    // Update logic
    if (newRole) targetUser.role = newRole;
    if (typeof isActive === "boolean") targetUser.isActive = isActive;

    await targetUser.save();
    res.status(200).json({
      success: true,
      message: "User status updated!",
      user: targetUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Route Admin Route file mein:
const getUserByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await User.findById(id).select("-password");
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    // Stats nikalne ke liye
    const regCount = await Animal.countDocuments({ uploadedBy: id });
    const verifiedCount = await Animal.countDocuments({
      uploadedBy: id,
      registrationStatus: "verified",
    });

    const stats = {
      totalRegistrations: regCount,
      efficiency:
        regCount > 0 ? ((verifiedCount / regCount) * 100).toFixed(1) : 0,
    };

    res.status(200).json({ success: true, user: worker, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort("-createdAt")
      .limit(10);
    const unreadCount = await Notification.countDocuments({ isRead: false });
    res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Mark as Read
const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { $set: { isRead: true } },
    );
    res.status(200).json({ message: "System Log cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getStats,
  pendingApprovels,
  verifiyAnimal,
  getRejectedAnimals,
  getAllWorkers,
  recheckRejectedAnimal,
  getAllWorkers,
  toggleWorkerStatus,
  deleteWorker,
  getAllAnimalsAdmin,
  adminDeleteAnimal,
  updateUserByAdmin,
  getUserByIdAdmin,
  getAdminNotifications,
  markAsRead,
};
