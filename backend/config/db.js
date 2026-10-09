const mongoose=require("mongoose");

const MongoDBConnect=async()=>{
    try {
        const url=process.env.MONGO_URL;
        await mongoose.connect(url);
        console.log("MongoDB Connect Successfully");        
    } catch (error) {
        console.log("Database Connection Error:",error);
        process.exit(1);
    }
}

module.exports=MongoDBConnect;