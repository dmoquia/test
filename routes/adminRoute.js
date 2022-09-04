const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Doctor = require("../models/DoctorModels");
const authMid = require("../middleware/authMid");
router.get("/get-all-doctors", authMid, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
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
router.get("/get-all-users", authMid, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      msg: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error fetching Users", success: false, error });
  }
});
router.post("/change-doctor-status", authMid, async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, { status });

    const user = await User.findOne({ _id: doctor.userId });
    // logic is the same w/ apply doctor account. paste the copied logic
    const unSeenNotification = user.unSeenNotification;
    // this is the notification part that the admin will be notified
    unSeenNotification.push({
      type: "new-doctor-request changed",
      msg: `Your doctor account has been ${status}`,
      // data: {
      //   doctorId: newDoctor._id,
      //   name: newDoctor.firstName + " " + newDoctor.lastName,
      // },
      onClickPath: "/notifications",
    });
    // this nothing but the user admin
    // await User.findByIdAndUpdate(user._id, { unSeenNotification });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    // end of copied logic

    res.status(200).json({
      msg: "Doctor status updated successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error updating doctors", success: false, error });
  }
});

module.exports = router;
