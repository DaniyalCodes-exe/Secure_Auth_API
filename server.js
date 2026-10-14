const express = require ("express");
const mongoose = require("mongoose");
require ("dotenv").config();

const app = express();

app.use(express.json());
const cookieParser = require("cookie-parser")
app.use(cookieParser());

const connectDB = async () => {
    try{ 
        await mongoose.connect(process.env.MONGO_URI,)
        console.log("MongoDB connected successfully...")
      
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
app.use("/api/auth",require("./routes/auth.routes"));
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`server is running on port : ${PORT}`);
});
