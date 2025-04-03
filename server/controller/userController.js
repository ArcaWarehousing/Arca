const yup = require("yup");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtAuth, sendEmail } = require("../middleware");
const { userModel } = require("../models/userModel");
const { default: mongoose } = require("mongoose");

let userLoginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  rememberMe: yup.boolean().required(),
});

exports.signup = async (req, res) => {
  try {
    const { email, password, rememberMe } = await userLoginSchema.validate(
      req.body
    );

    const emailModelResult = await userModel.exists({ email: email });
    if (emailModelResult) throw new Error("User already exists");

    const uid = uuidv4();
    const salt = await bcrypt.genSalt(7);
    const hash = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      uid: uid,
      email: email,
      password: hash,
    });

    const token = jwt.sign({ uid: user._id }, process.env.SERVER_SECRET_JWT, {
      expiresIn: rememberMe ? "90d" : "1d",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
    });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password, rememberMe } = await userLoginSchema.validate(
      req.body
    );
    const emailModelResult = await userModel.findOne({ email: email });
    if (emailModelResult == null) throw new Error("User does not exist");
    const savedPasswordHash = emailModelResult.password;
    bcrypt.compare(password, savedPasswordHash, function (err, result) {
      if (result) {
        const token = jwt.sign(
          { uid: emailModelResult._id },
          process.env.SERVER_SECRET_JWT,
          { expiresIn: rememberMe ? "90d" : "1d" }
        );

        res.cookie("authToken", token, {
          httpOnly: true,
          secure: false,
        });
        res.status(200).json({ token });
      } else {
        res.status(400).send({ message: "Invalid Password" });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let passwordSchema = yup.object({
      email: yup.string().email().required(),
    });

    const { email } = await passwordSchema.validate(req.params);

    var user = await userModel.findOne({ email: email });
    // Dont want to verify user donest exist
    if (user == null) return res.sendStatus(200);
    const newPassword = uuidv4().substring(0, 8);
    const response = await bcrypt.genSalt(7, function (err, salt) {
      bcrypt.hash(newPassword, salt, function (err, hash) {
        // Store hash in your password DB.
        user.password = hash;
        user.save();
      });
    });

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

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("authToken");
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    res.status(404).send("Not implemented yet");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
let inputProfileSchema = yup.object({
  email: yup.string().email(),
  // TODO: make better
  phoneNumber: yup.string().matches(phoneRegExp, "Phone number is not valid"),
  companyName: yup.string(),
});

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

exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.uid);
    res.status(200).json(outputProfileCleaner(user));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const validatedResponse = await inputProfileSchema.validate(req.body);
    let user = await userModel.findById(req.user.uid);

    if (validatedResponse.email != user.email) {
      const otherUser = await userModel.exists({
        email: validatedResponse.email,
      });
      if (otherUser != false) user.email = validatedResponse.email;
      else throw new Error("Email already exists");
    }
    if (validatedResponse.password != null) {
      const salt = bcrypt.genSalt(7);
      const hash = bcrypt.hash(validatedResponse.password, salt);
      user.password = hash;
    }
    // TODO Check if valid number
    if (validatedResponse.phoneNumber != null)
      user.phoneNumber = validatedResponse.phoneNumber;

    if (validatedResponse.companyName != null)
      user.companyName = validatedResponse.companyName;
    if (validatedResponse.firstName != null)
      user.firstName = validatedResponse.firstName;
    if (validatedResponse.lastName != null)
      user.lastName = validatedResponse.lastName;
    if (validatedResponse.verificationRequested != null)
      user.verificationRequested = validatedResponse.verificationRequested;

    user.save();
    res.status(200).json(outputProfileCleaner(user));
  } catch (error) {
    const errorMsg = "Server error: " + error.message + ".";
    res.status(500).json({ message: errorMsg });
  }
};

exports.secureUpload = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.uid);

    const insuranceFile = req.file.id;
    user.insuranceFile.push(insuranceFile);
    user.save();

    res.status(200).send({ message: "File uploaded" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.requestVerification = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.uid);
    const request = {
      person: process.env.BACKEND_NOTIFY_EMAIL.split(" "),
      subject: "New User Needs Verification",
      message:
        "<b>This is a automated message</b><br> User: " +
        user.firstName +
        " " +
        user.lastName +
        " at " +
        user.email +
        " requires verification for their insurance<br/>",
    };
    console.log("User Requested Verification")
    sendEmail(request);
    res.status(200).send({ message: "Verification requested" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};