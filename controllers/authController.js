const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

//ACCESS TOKEN GENERATOR
const GenerateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.ACCESS_EXPIRES_IN,
  });
};
//REFRESH TOKEN GENERATOR
const GenerateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_EXPIRES_IN,
  });
};

// REGISTER LOGIC
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "user already exist",
      });
    }
    const user = await userModel.create({ name, email, password, role });

    // generate TOKEN
    const accessToken = GenerateAccessToken(user._id);
    const refreshToken = GenerateRefreshToken(user._id);

    //STORE IN COOKIE : refreshToken

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      success: true,
      accessToken,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error",
      status: "failed",
      error: error.message,
    });
  }
};

//LOGIN LOGIC
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // CHECK THE EMAIL FROM DATABASE
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "INVALID INFO",
      });
    }
    //COMPARING THE PASSWORD
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "INVALID INFO",
      });
    }
    user.password = undefined;
     // generate TOKEN
    const accessToken = GenerateAccessToken(user._id);
    const refreshToken = GenerateRefreshToken(user._id);
    //generate TOKEN in Islogin side
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //Days
    });

    res.status(200).json({
      success: true,
      accessToken,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

exports.getUserProfile = async (req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    });
};

exports.getAllUsers = async (req,res) =>{
    try{
        const users = await userModel.find();
        res.status(200).json({
            success : true,
            count : users.length,
            users
        })

    }catch(error){
        res.status(500).json({message:"server error"});
    }
};