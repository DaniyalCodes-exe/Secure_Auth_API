const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true,
        unique:true,
        lowercase:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"please provide a valid email"],
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password must be contain 6 characters."],
        select:false,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
},{timestamps:true});

//SMART WORK : pre-save Hook (auto-Hashing)
userSchema.pre("save", async function () {
  if(!this.isModified("password"))
    return ;
  //Hasing the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
  
});
// CUSTOM CHECK : password check for login 

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
    
}
 

module.exports = mongoose.model("user",userSchema);