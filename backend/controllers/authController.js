import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req , res) =>{

    const {name , email , password, confirmPassword} = req.body;
    
    if (!name || !email || !password || !confirmPassword){
        return res.status(400).json({success: false , message: "Please fill all the fields"});
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords does not match' });
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    try {
        const existingUser = await userModel.findOne({email});
        
        if (existingUser){
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password , 10); 
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            role: 'user',
        });
        
        await user.save();
        
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET , {expiresIn: "7d"});
        
        
        res.cookie('token' , token ,{
            
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : "Welcome to our website",
            text : `Thank you for registering in our website, your account is registered for ${email}`
            
        }

        try {
            await transporter.sendMail(mailOption);
            res.status(201).json({ success: true, message: "Registration successful, verification email sent!" });
        } catch (error) {
        res.status(500).json({ success: false, message: "Registration successful, but email sending failed. Contact support." });
        }

    } catch (error) {
        console.log(error);
        res.json({success: false , message: "Error in Register authController", error});
    }
}


// Login Functionality
export const login = async (req , res) =>{
    const {email , password} = req.body;

    console.log("Login request body:", req.body);

    if (!email || !password){
        return res.status(400).json({success: false , message: "Please fill all the fields"});
    }

    try {
        const user = await userModel.findOne({email});
        if (!user){
            return res.status(404).json({success: false , message: "No user found with this email."});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch){
            return res.status(400).json({success: false , message: "Invallid Password "});
        }

        const token = jwt.sign(
            {id : user._id, role: user.role },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production, false in development
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site, 'lax' for same-site
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json(
            {
                success: true ,
                message: "Login Successfully", 
                token,
                role: user.role,
                userId: user._id,
                userData:user
            });


    } catch (error) {
        console.log(`error in this${error}`);
        return res.json({success: false , message: `Error in Login authController ${error}`});
    }
}


// Logging Out users and admins
export const logout = async (req , res) =>{
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({success: true , message: "Logout Successfully"});
        
        
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

export const sendVerifyOtp = async (req , res) =>{
    try {
        const {userId} = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isUserVerified){
            return res.json({success: false , message: "User is already verified"});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));


        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 5 * 60 * 1000;

        await user.save();

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : "Account Verification OTP",
            // text : `Your OTP for account verification is ${otp},
            // this OTP will expire in 5 minutes`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transporter.sendMail(mailOption);

        res.json({success: true , message: "Verification OTP sent on Email"});

    } catch (error) {
        return res.json({success: false , message: error.message});
    }
}

// verifying email through otp
export const verifyEmail = async (req , res) =>{
        const {userId , otp} = req.body;

        if (!userId || !otp){
            return res.json({ success : false , message : 'Missing Details'})
        }

        try {
            const user = await userModel.findById(userId);
            
            if (!user){
                return res.status(400).json({success: false, message: "User not found!!"})
            }

            if (user.verifyOtp === '' || user.verifyOtp != otp){
                return res.status(400).json({success:false , message:"OTP is incorrect"})
            }

            if (user.verifyOtpExpiresAt < Date.now()){
                return res.status(400).json({success:false , message:"OTP expired"})
            }

            user.isUserVerified = true;
            user.verifyOtp = '';
            user.verifyOtpExpiresAt = 0;

            await user.save();
            return res.status(200).json({success:true , message:"Account Verified Successfully"});

        } catch (error) {
            return res.status(500).json({success : false , message : error.message})
        }

}

// Check if user is authenticated
export const isAuthenticated = async (req , res) =>{
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
    
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
        res.json({ success: true, isUserVerified: user.isUserVerified });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Send reset password OTP

export const sendResetOtp = async (req , res) =>{
    const {email} = req.body;

    if (!email){
        return res.json({success:false , message:"Email is required"})
    }

    try {
        
        const user = await userModel.findOne({email});
        if (!user){
            return res.json({success:false , message:"User not found"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));


        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() + 5 * 60 * 1000;

        await user.save();

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : "Password Reset OTP",
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transporter.sendMail(mailOption);

        return res.json({success: true , message: "Reset OTP sent on your Email"});

    }catch (error) {
        return res.json({success:false , message: error.message})
    }
}

//  Reset Password
export const resetPassword = async (req , res) =>{
    const {email , otp , newPassword} = req.body;
    
    if (!email || !otp || !newPassword){
        return res.json({success:false , message:"All fields are required"})
    }

    try {
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({success:false , message:"User not found"})
        }

        if (user.resetOtp === '' || user.resetOtp !== otp){
            return res.status(400).json({success:false , message:"OTP is incorrect"})
        }

        if(user.resetOtpExpiresAt < Date.now()){
            return res.status(400).json({success:false , message:"OTP expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiresAt = 0;

        await user.save();

        return res.json({success:true , message:"Password Reset Successfully"});


    } catch (error) {
        return res.json({success:false , message:error.message})
    }
}

//  Add a New User 
export const addUser = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
        return res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
      }
  
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({ name, email, password: hashedPassword, role: 'user' });
      await newUser.save();
  
      res.status(201).json({ success: true, message: "User added successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
    //   Update a User 
  export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, email, password } = req.body;
    
    console.log("Received userId:", userId);  
    console.log("Received body:", req.body);  

    try {
      if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
        return res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
      }
  
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }
        user.password = await bcrypt.hash(password, 10);
      }
  
      await user.save();
      res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
      console.error("Update User Error:", error);  
      res.status(500).json({ success: false, message: error.message });
    }
};

  
  //  Delete a User 
  export const deleteUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
        return res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
      }
  
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      await userModel.deleteOne({ _id: userId });
  
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  