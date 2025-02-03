import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['superadmin','admin', 'user'], default: 'user' },
    isUserVerified: { type: Boolean, default: false },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpiresAt: { type: Number, default: 0 },
    resetOtp: { type: String, default: '' },
    resetOtpExpiresAt: { type: Number, default: 0 },
});

// Create a model named 'user' using the userSchema
// If the model already exists, use the existing one, otherwise create a new one
const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;