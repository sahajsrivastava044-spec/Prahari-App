const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGNUP
signup = async (req, res) => {
  try {
    const { name, phone, village, role, password } = req.body;


    if (!name || !phone || !village || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }


    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      phone,
      village,
      role,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        village: user.village,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// LOGIN
login = async (req, res) => {
  try {
    const { phone, password } = req.body;


    if (!phone || !password) {
      return res.status(400).json({
        message: "Please provide phone and password",
      });
    }


    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        village: user.village,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports={login,signup};