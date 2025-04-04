const yup = require("yup"); // schema builder for value parsing and validation
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../middleware");
const { userModel } = require("../models/userModel");
const { generateToken } = require('../utils/jwtUtil');
const { hashPassword, verifyPassword } = require('../utils/passwordUtil';

/**
 * User authentication controller
 * This module handles user authentication using NextAuth integration
 * It provides endpoints for user registration, login, profile management,
 * and verification processes
 */

class userController {
  // /**
  //  * Get all users
  //  * Retrieves a list of all users from the database
  //  * @param {Object} req - Express request object
  //  * @param {Object} res - Express response object
  //  */
  // async getAllUsers(req, res) {
  //   try {
  //     const users = await userModel.findAllUsers();
  //     res.status(200).json({ users });
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //     res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  //   }
  // }

  /**
   * Get user by ID
   * Retrieves a specific user by their ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const user = await userModel.findUserById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
  }

  /**
   * Create user
   * Creates a new user in the database
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createUser(req, res) {
    try {
      const userData = req.body;
      // TODO: validate input data
      // Generate UUID and hash password if provided
      const uid = uuidv4();
      
      if (userData.password) {
        const salt = await bcrypt.genSalt(7);
        userData.password = await bcrypt.hash(userData.password, salt);
      }
      
      // Create the user with the provided data
      const user = await userModel.createUser({
        uid,
        ...userData
      });
      
      res.status(201).json({ 
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
  }
}


/************* Old code ***************/
// Validation schema for login/signup requests
let userLoginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required(),
  // rememberMe: yup.boolean().required(), // TODO: user auth persistence
});

/**
 * User registration endpoint
 * Creates a new user account and returns a JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, confirmPassword, rememberMe } = await userLoginSchema.validate(
      req.body
    );

    // Check if user already exists
    const userExists = await userModel.checkUserExists({ email: email });
    if (userExists) throw new Error("User already exists");

    // Create new user with hashed password
    const uid = uuidv4();
    const hashedPassword = await hashPassword(password);
    const user = await userModel.createUser({
      uid: uid,
      email: email,
      password: hashedPassword,
    });

    // Generate JWT token for NextAuth session
    const token = generateToken({ uid: user._id }, rememberMe);

    // Return token for client-side NextAuth session
    res.status(200).json({ 
      user: {
        id: user._id,
        email: user.email
      },
      token 
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

/**
 * User login endpoint
 * Authenticates user credentials and returns a JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.signin = async (req, res) => {
  try {
    const { email, password, rememberMe} = await userLoginSchema.validate(
      req.body
    );
    
    // Find user by email
    const user = await userModel.findUser({ email: email });
    if (!user) throw new Error("User does not exist");
    
    // Verify password
    const isPasswordValid = verifyPassword(password, user.password);
    
    if (isPasswordValid) {
      const token = generateToken({ uid: user._id }, rememberMe);

      // Return user data and token for NextAuth session
      res.status(200).json({ 
        user: {
          id: user._id,
          email: user.email
        },
        token 
      });
    } else {
      res.status(400).send({ message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

/**
 * Password reset endpoint
 * Generates a new random password and emails it to the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.forgotPassword = async (req, res) => {
  //TODO: implement forgot pw flow
  try {
    let passwordSchema = yup.object({
      email: yup.string().email().required(),
    });

    const { email } = await passwordSchema.validate(req.params);

    // Find user by email
    var user = await userModel.findUser({ email: email });
    // Don't reveal if user exists for security
    if (!user) return res.sendStatus(200);
    
    // Generate new random password
    const newPassword = uuidv4().substring(0, 8);
    
    // Hash and save new password
    const salt = await bcrypt.genSalt(7);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();

    // Send password reset email
    const request = {
      person: email,
      subject: "Password Reset",
      message:
        "<b>New Password</b><br> Your new password is: " +
        newPassword +
        "<br/>",
    };
    sendEmail(request);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * User logout endpoint
 * For NextAuth, most logout functionality is handled client-side
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.logoutUser = async (req, res) => {
  try {
    // NextAuth handles session cleanup on client side
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * User deletion endpoint (not implemented)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
  try {
    res.status(404).send("Not implemented yet");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Phone number validation regex
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// Profile update validation schema
let inputProfileSchema = yup.object({
  email: yup.string().email(),
  phoneNumber: yup.string().matches(phoneRegExp, "Phone number is not valid"),
  companyName: yup.string(),
  firstName: yup.string(),
  lastName: yup.string(),
  verificationRequested: yup.boolean()
});

/**
 * Formats user data for client response
 * @param {Object} user - User database object
 * @returns {Object} Cleaned user profile data
 */
const outputProfileCleaner = (user) => {
  return {
    email: user.email,
    phoneNumber: user.phoneNumber,
    companyName: user.companyName,
    firstName: user.firstName,
    lastName: user.lastName,
    eligibleSeller: user.eligibleSeller,
    eligibleBuyer: user.eligibleBuyer,
    insuranceUploaded: user.insuranceFile.length > 0,
    verificationRequested: user.verificationRequested
  };
};

/**
 * Get user profile endpoint
 * Returns user profile data for authenticated users
 * @param {Object} req - Express request object with user from NextAuth session
 * @param {Object} res - Express response object
 */
exports.getProfile = async (req, res) => {
  try {
    // NextAuth provides user in req.user
    const user = await userModel.findUserById(req.user.uid);
    res.status(200).json(outputProfileCleaner(user));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * Update user profile endpoint
 * Updates user profile data for authenticated users
 * @param {Object} req - Express request object with user from NextAuth session
 * @param {Object} res - Express response object
 */
exports.updateProfile = async (req, res) => {
  try {
    const validatedResponse = await inputProfileSchema.validate(req.body);
    let user = await userModel.findUserById(req.user.uid);

    // Check if email is being changed and if it's already in use
    if (validatedResponse.email && validatedResponse.email !== user.email) {
      const emailExists = await userModel.checkUserExists({
        email: validatedResponse.email,
      });
      if (emailExists) throw new Error("Email already exists");
      user.email = validatedResponse.email;
    }
    
    // Update password if provided
    if (validatedResponse.password) {
      const salt = await bcrypt.genSalt(7);
      const hash = await bcrypt.hash(validatedResponse.password, salt);
      user.password = hash;
    }
    
    // Update other profile fields if provided
    if (validatedResponse.phoneNumber !== undefined)
      user.phoneNumber = validatedResponse.phoneNumber;

    if (validatedResponse.companyName !== undefined)
      user.companyName = validatedResponse.companyName;
      
    if (validatedResponse.firstName !== undefined)
      user.firstName = validatedResponse.firstName;
      
    if (validatedResponse.lastName !== undefined)
      user.lastName = validatedResponse.lastName;
      
    if (validatedResponse.verificationRequested !== undefined)
      user.verificationRequested = validatedResponse.verificationRequested;

    await user.save();
    res.status(200).json(outputProfileCleaner(user));
  } catch (error) {
    const errorMsg = "Server error: " + error.message + ".";
    res.status(500).json({ message: errorMsg });
  }
};

/**
 * File upload endpoint for insurance documents
 * @param {Object} req - Express request object with user from NextAuth session
 * @param {Object} res - Express response object
 */
exports.secureUpload = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.uid);

    const insuranceFile = req.file.id;
    user.insuranceFile.push(insuranceFile);
    await user.save();

    res.status(200).send({ message: "File uploaded" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * Request verification endpoint
 * Sends email notification for user verification request
 * @param {Object} req - Express request object with user from NextAuth session
 * @param {Object} res - Express response object
 */
exports.requestVerification = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.uid);
    const request = {
      person: process.env.BACKEND_NOTIFY_EMAIL.split(" "),
      subject: "New User Needs Verification",
      message:
        "<b>This is an automated message</b><br> User: " +
        user.firstName +
        " " +
        user.lastName +
        " at " +
        user.email +
        " requires verification for their insurance<br/>",
    };
    console.log("User Requested Verification");
    // sendEmail(request); //TODO: enable text/email communication with customers
    res.status(200).send({ message: "Verification requested" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};