import React, { useEffect, useState } from "react";
import DoctorForm from "../../components/DoctorForm";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showLoading, hideLoading } from "../../redux/alertSlice";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";
function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/update-doctor-profile",
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
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/doctor/get-doctor-info-by-user-id`,
        // { userId: user._id },
        { userId: params.userId },

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">doctor's profile</h1>
      {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
    </Layout>
  );
}

export default Profile;
