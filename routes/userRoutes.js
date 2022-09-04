const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Doctor = require("../models/DoctorModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMid = require("../middleware/authMid");
const Appointment = require("../models/Appointment");
const moment = require("moment");
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ msg: "User already exists", success: false });
    }
    user = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(200).json({ msg: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error Creating User", success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ msg: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ msg: "Invalid Credentials", success: false });
    } else {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res
        .status(200)
        .json({ msg: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error Login in", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMid, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ mesage: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,

        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ msg: "Error getting user info", success: false, error });
  }
});

router.post("/apply-doctor-account", authMid, async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    await newDoctor.save(); // first we are going to save the doctor
    const adminUser = await User.findOne({ isAdmin: true });
    const unSeenNotification = adminUser.unSeenNotification;
    // this is the notification part that the admin will be notified
    unSeenNotification.push({
      type: "new-doctor-request",
      msg: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      // onClickPath: "/admin/doctors",
      onClickPath: "/admin/doctorslist",
    });
    // this nothing but the user admin
    await User.findByIdAndUpdate(adminUser._id, { unSeenNotification });
    res.status(200).json({
      success: true,
      msg: "Doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error Applying Doctor Account", success: false, error });
  }
});
router.post("/mark-all-notification-as-seen", authMid, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    // initialize the all the unseen notifications
    const unseenNotification = user.unSeenNotification;
    // now lets move the unseen notification to seen.
    const seenNotifications = user.seenNotification;
    seenNotifications.push(...unseenNotification);
    // lets empty the unseen
    user.unSeenNotification = [];
    user.seenNotification = seenNotifications;
    // const updatedUser = await User.findByIdAndUpdate(user._id, user);
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).json({
      msg: "All notification marked as seen",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error Applying Doctor Account", success: false, error });
  }
});
router.post("/delete-all-notification", authMid, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotification = [];
    user.unSeenNotification = [];

    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).json({
      msg: "all notifications cleared",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error Applying Doctor Account", success: false, error });
  }
});

router.get("/get-all-approved-doctors", authMid, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res.status(200).json({
      msg: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error fetching Doctors", success: false, error });
  }
});

router.post("/book-appointment", authMid, async (req, res) => {
  try {
    req.body.status = "pending";
    //from here
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    //to here
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    // pushing notification base on his userId
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unSeenNotification.push({
      type: "new-appointment-request",
      msg: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();

    res.status(200).json({
      msg: "appointment request has been successfully submitted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error booking appointment", success: false, error });
  }
});
router.post("/check-booking-availability", authMid, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      // .subtract(60, "minutes")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm")
      // .add(60, "minutes")
      .add(1, "hours")
      .toString();
    const { doctorId } = req.body;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
      // status: "approved",
    });

    if (appointments.length > 0) {
      return res.status(200).json({
        msg: "Appointments not available",
        success: false,
      });
    } else {
      return res.status(200).json({
        msg: "Appointments available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error checking availability", success: false, error });
  }
});
router.get("/get-appointments-by-user-id", authMid, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.body.userId,
    });
    res.status(200).json({
      msg: "Appointments fetch successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error fetching appointments", success: false, error });
  }
});
module.exports = router;
