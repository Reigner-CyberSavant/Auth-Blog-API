const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: [true, "Email must be trimmed"],
        lowercase: [true, "Email must be lowercase"],
        minlenght: 5,
        maxlength: 50,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: [true, "Password must be trimmed"],
        select: false, // Do not return password in queries by default
        minlenght: 6,
        maxlength: 1024,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        select: false, // Do not return verification token in queries by default
    },
    verificationCodevalidation: {
        type: Number,
        select: false, // 
    },
    forgotPasswordCode: {
        type: String,
        select: false, 
    },
    forgotPasswordCodeValidation: {
        type: Number,
        select: false, 
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model("User", userSchema);