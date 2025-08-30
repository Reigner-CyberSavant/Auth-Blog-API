// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { signupSchema, signinSchema, acceptCodeSchema, changePasswordSchema, acceptForgotPasswordCodeSchema } = require('../middlewares/validators');
const { hashPassword, hmacProcess } = require('../utils/hashing');
const User = require('../models/user.model');
const transporter = require('../middlewares/sendmail');



// === SIGNUP CONTROLLER ===
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate user input
    const { error } = signupSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user to DB
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const result = await newUser.save();
    result.password = undefined; // Hide hashed password from response

    return res.status(201).json({
      message: "User created successfully",
      user: result,
    });

    } catch (err) {
        next(err);
    }
};

// === SIGNIN CONTROLLER ===
// POST request — test in Postman with raw JSON in body
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    const { error } = signinSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find user and include password
    const existingUser = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!existingUser) {
      return res.status(400).json({ error: "Invalid email or password or user does not exist" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    return res.status(200).json({
      message: "Signin successful",
      user: {
        email: existingUser.email,
        id: existingUser._id
      }
    });

     } catch (err) {
        next(err);
    }
};

// === SIGNOUT CONTROLLER ===
exports.signout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: "Signed out successfully" });
};

// === SEND VERIFICATION CODE ===
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Already verified
    if (existingUser.verified) {
      return res.status(400).json({ error: "User already verified" });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

    let info = await transporter.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Verification code",
      html: `<h1>${verificationCode}</h1>`
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(verificationCode, process.env.HMAC_VERIFICATION_CODE_SECRET);
      existingUser.verificationCode = hashedCodeValue;
      existingUser.verificationCodevalidation = Date.now() + 10 * 60 * 1000; // 10 minutes validity
      await existingUser.save();
      return res.status(200).json({ message: "Verification code sent successfully" });
    }
    return res.status(500).json({ error: "Failed to send verification code" });

    } catch (err) {
        next(err);
    }
}



//VERIFY VERIFICATION CODE
exports.verifyVerificationCode = async (req, res) => {
  
  const {email, providedCode} = req.body;
  try {
    // Validate input
    const { error } = acceptCodeSchema.validate({ email, providedCode });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    

    const codeValue = providedCode.toString();
    // Find user
    const existingUser = await User.findOne({email}).select('+verificationCode +verificationCodevalidation');
    if (!existingUser) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Check if user is already verified
    if (existingUser.verified) {
      return res.status(400).json({ error: "User already verified" });
    }

    // Unexpected code error
    if (!existingUser.verificationCode || !existingUser.verificationCodevalidation) {
      return res.status(400).json({ error: "Verification code not sent or expired" });
    }

    // If code was sent but expired after 5 minutes
    if( Date.now() > existingUser.verificationCodevalidation > 5* 60 * 1000) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    // Validate provided code
    const hashedProvidedCode = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

    if (hashedProvidedCode === existingUser.verificationCode) {
      // Mark user as verified
      existingUser.verified = true;
      existingUser.verificationCode = undefined; // Clear verification code
      existingUser.verificationCodevalidation = undefined; // Clear validation time
      await existingUser.save();

      return res.status(200).json({success: true, message: "User verified successfully" });
    }
    return res.status(400).json({ error: "Unexpected error occured" });

    } catch (err) {
        next(err);
    }
}



//CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const {userId, verified} = req.user;
  const {oldPassword, newPassword} = req.body;

  try {
     // Validate input
    const { error} = changePasswordSchema.validate({ oldPassword, newPassword });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    //Check if user's not verified
    if (!verified){
      return res.status(400).json({ error: "You are not verified" });
    }

    //Check if user is existing
    const existingUser = await User.findOne({_id:userId.select('+password') });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    const result = await doHashedValidation(oldPassword, existingUser.password)
    if(!result){
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res.status(200).json({ success: true, message: "Password change successfully" });


    } catch (err) {
        next(err);
    }
}



//FORGOT PASSWORD 

exports.sendForgotPasswordCode = async (req, res) => {
  const { email } = req.body;
  try {
    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

    let info = await transporter.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Forgot Password code",
      html: `<h1>${verificationCode}</h1>`
    });


    //If email is accepted then we save to the database
    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(verificationCode, process.env.HMAC_VERIFICATION_CODE_SECRET);
      existingUser.forgotPasswordCode = hashedCodeValue;
      existingUser.forgotPasswordCodevalidation = Date.now() + 10 * 60 * 1000; // 10 minutes validity
      await existingUser.save();
      return res.status(200).json({ message: " Code sent successfully" });
    }
    return res.status(500).json({ error: "Failed to send code" });

    } catch (err) {
        next(err);
    }
};




//VERIFY FORGOT PASSWORD CODE

exports.verifyForgotPasswordCode = async (req, res) => {
  
  const {email, providedCode, newPassword} = req.body;
  try {
    // Validate input
    const { error } = acceptForgotPasswordCodeSchema.validate({ email, providedCode, newPassword });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    

    const codeValue = providedCode.toString();
    // Find user
    const existingUser = await User.findOne({email}).select('+forgotPasswordCode +forgotPasswordCodevalidation');
    if (!existingUser) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Unexpected code error
    if (!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodevalidation) {
      return res.status(400).json({ error: "Verification code not sent or expired" });
    }

    // If code was sent but expired after 5 minutes
    if( Date.now() > existingUser.forgotPasswordCodevalidation > 5* 60 * 1000) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    // Validate provided code
    const hashedProvidedCode = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

    if (hashedProvidedCode === existingUser.forgotPasswordCode) {
      const hashedPassword = await hashPassword(newPassword);
      existingUser.password = hashedPassword;
      existingUser.forgotPasswordCode = undefined; // Clear verification code
      existingUser.forgotPasswordCodevalidation = undefined; // Clear validation time
      await existingUser.save();

      return res.status(200).json({success: true, message: "Password Updated" });
    }
    return res.status(400).json({ error: "Unexpected error occured" });

    } catch (err) {
        next(err);
    }
}
