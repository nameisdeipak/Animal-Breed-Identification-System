require("dotenv").config();
const express =require("express");
const app=express();
const cors=require("cors");
const cookiesParser=require("cookie-parser");
const MongoDBConnect=require("./config/db");


// Routes
const authRoute=require("./routes/authRoutes");
const animalRoute=require("./routes/animalRoutes");
const adminRoute=require("./routes/adminRoutes");

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))

app.use(express.json());
app.use(cookiesParser());

app.use("/AnimalBreed/api/auth",authRoute);
app.use("/AnimalBreed/api/animal",animalRoute);
app.use("/AnimalBreed/api/admin",adminRoute);


MongoDBConnect()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server Runnign on Port ${process.env.PORT}`);
    });
}).catch((err)=>{
    console.log("Server Error :",err);
});
