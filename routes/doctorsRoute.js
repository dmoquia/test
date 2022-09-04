const express = require("express");
const router = express.Router();
const Doctor = require("../models/DoctorModels");
const User = require("../models/User");
const authMid = require("../middleware/authMid");
const Appointment = require("../models/Appointment");
router.post("/get-doctor-info-by-user-id", authMid, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    // const doctor = await Doctor.findOne({ _id: req.body.userId });
    res.status(200).json({
      msg: "Doctor info fetch successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ msg: "Error getting doctor info", success: false, error });
  }
});
router.post("/update-doctor-profile", authMid, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId }, //<-- once we find the user id
      req.body // <-then this right here we are going to update the complete body or the whole user object
    );
    // const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).json({
      msg: "Doctor profile updated successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ msg: "Error getting doctor info", success: false, error });
  }
});

router.post("/get-doctor-info-by-id", authMid, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    // const doctor = await Doctor.findOne({ _id: req.body.userId });
    res.status(200).json({
      msg: "Doctor info fetch successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ msg: "Error getting doctor info", success: false, error });
  }
});
router.get("/get-appointments-by-doctor-id", authMid, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    const appointments = await Appointment.find({ doctorId: doctor._id });
    res.status(200).json({
      // msg: "Doctor info fetch successfully",
      msg: "Appointment fetch successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ msg: "Error getting Appointment info", success: false, error });
  }
});

router.post("/change-appointment-status", authMid, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });

    const user = await User.findOne({ _id: appointment.userId });

    const unSeenNotification = user.unSeenNotification;

    unSeenNotification.push({
      type: "Appointment status changed",
      msg: `Your appointment status has been ${status}`,

      onClickPath: "/appointments",
    });

    // user.isDoctor = status === "approved" ? true : false;
    await user.save();

    res.status(200).json({
      msg: "Appointment status change successfully ",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error changin the appointment status",
      success: false,
      error,
    });
  }
});

module.exports = router;
