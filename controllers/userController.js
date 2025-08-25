import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

//create token
const createToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET);
}

// Strong password validation
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
        return { isValid: false, message: "Password must be at least 8 characters long" };
    }
    if (!hasUpperCase) {
        return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!hasLowerCase) {
        return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!hasNumbers) {
        return { isValid: false, message: "Password must contain at least one number" };
    }
    if (!hasSpecialChar) {
        return { isValid: false, message: "Password must contain at least one special character" };
    }
    
    return { isValid: true, message: "Password is strong" };
};

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    
    try {
        // Input validation
        if (!email || !password) {
            return res.status(400).json({success: false, message: "Email and password are required"});
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({success: false, message: "Please enter a valid email"});
        }
        
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(401).json({success: false, message: "Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).json({success: false, message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success: true, token})
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({success: false, message: "Internal server error"})
    }
}

//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    
    try {
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({success: false, message: "Name, email, and password are required"});
        }
        
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.status(409).json({success: false, message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message: "Please enter a valid email"})
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({success: false, message: passwordValidation.message});
        }

        // hashing user password
        const salt = await bcrypt.genSalt(12); // Increased from 10 to 12 for better security
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({name, email, password: hashedPassword})
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success: true, token})

    } catch(error){
        console.error('Registration error:', error.message);
        res.status(500).json({success: false, message: "Internal server error"})
    }
}

// Find or create user by firebaseUid (for Firebase Auth integration)
const findOrCreateUser = async (req, res) => {
  const { firebaseUid, email, name } = req.body;
  
  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    
    let user = await userModel.findOne({ firebaseUid });
    if (!user) {
      user = await userModel.create({ firebaseUid, email, name });
    }
    res.json({ success: true, userId: user._id });
  } catch (error) {
    console.error('FindOrCreate error:', error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {loginUser, registerUser, findOrCreateUser}