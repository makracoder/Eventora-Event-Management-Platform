const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/email');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      isVerified: false
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP for ${email}: ${otp}`);
    await Otp.create({ email, otp, action: 'account_verification' });
    await sendOTPEmail(email, otp, 'account_verification');

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials, please sign up first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified && user.role === 'user') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await Otp.deleteMany({ email, action: 'account_verification' });
      console.log(`Generated OTP for ${email}: ${otp}`);
      await Otp.create({ email, otp, action: 'account_verification' });
      await sendOTPEmail(email, otp, 'account_verification');
      return res.status(403).json({ message: 'Account not verified. Please check your email for the OTP.' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await Otp.findOne({ email, otp, action: 'account_verification' });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
    await Otp.deleteMany({ email, action: 'account_verification' });

    res.status(200).json({
      message: 'OTP verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};