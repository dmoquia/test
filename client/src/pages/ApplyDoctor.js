import React from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/alertSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";
function ApplyDoctor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/apply-doctor-account",
        {
          ...values,
          userId: user._id,
          schedule: [
            moment(values.schedule[0]).format("HH:MM"), //start time
            moment(values.schedule[1]).format("HH:MM"), //end time
          ],
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.msg);

        navigate("/");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };
  return (
    <Layout>
      <h1 className="page-title">apply doctor</h1>
      <DoctorForm onFinish={onFinish} />
    </Layout>
  );
}

export default ApplyDoctor;
