import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertSlice";
import toast from "react-hot-toast";

function BookAppointment() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const [isAvailable, setAvailable] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/doctor/get-doctor-info-by-id`,

        { doctorId: params.doctorId },
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
  const bookNow = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        // `/api/doctor/book-appointment`,
        `/api/user/book-appointment`,
        {
          doctorId: params.doctorId,
          userId: user._id,
          date: date,
          time: time,
          doctorInfo: doctor,
          userInfo: user,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.success);
        toast.success(response.data.msg);
      }
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
      dispatch(hideLoading());
    }
  };
  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        // `/api/user/book-appointment`,
        `/api/user/check-booking-availability`,
        {
          // userId: user._id,
          // doctorInfo: doctor,
          // userInfo: user,
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.msg);
        setAvailable(true);
        navigate("/appointments");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error("Error Booking appointment");
      console.log(error);
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    // <Layout>
    //   {doctor && (
    //     <div className="page-title">
    //       <h1 className="page-title">
    //         {doctor.firstName} {doctor.lastName}
    //       </h1>

    //       <hr />
    //       <h1 className="normal-text">
    //         <b>
    //           Schedule : {doctor.schedule[0]} - {doctor.schedule[1]}
    //         </b>
    //         <p className="normal-text">
    //           <b>Phone : </b>
    //           {doctor.phoneNumber}
    //         </p>
    //         <p className="normal-text">
    //           <b>Address : </b>
    //           {doctor.address}
    //         </p>
    //         <p className="normal-text">
    //           <b>fee per visit : </b>
    //           {doctor.feePerConsultation}
    //         </p>
    //       </h1>

    //       {/* <Row > */}
    //       <Row gutter={20}>
    //         <Col span={12} sm={24} xs={24} lg={6}>
    //           <div className="d-flex flex-column pt-2">
    //             <DatePicker
    //               format="DD-MM-YYYY"
    //               onChange={(values) =>
    //                 setDate(moment(values).format("DD-MM-YYYY"))
    //               }
    //             />
    //             <TimePicker
    //               format="HH:mm"
    //               className="mt-3"
    //               onChange={(value) => {
    //                 setAvailable(false);
    //                 setTime(moment(value).format("HH:mm"));
    //               }}
    //             />
    //             {!isAvailable && (
    //               <Button
    //                 className="primary-button mt-3 full-width-button"
    //                 onClick={checkAvailability}
    //               >
    //                 Check Availability
    //               </Button>
    //             )}
    //             {isAvailable && (
    //               <Button
    //                 className="primary-button mt-3 full-width-button"
    //                 onClick={bookNow}
    //               >
    //                 Book now
    //               </Button>
    //             )}
    //           </div>
    //         </Col>
    //         {/* <Col> */}
    //         <Col span={12} sm={24} xs={24} lg={6}>
    //           {/* <div
    //             className="card"
    //             onClick={() => navigate(`/book-appointment/${doctor._id}`)}
    //           > */}
    //           {/* <h1 className="card-title">
    //             {doctor.firstName} {doctor.lastName}
    //           </h1> */}
    //           {/* <hr /> */}
    //           {/* <p className="normal-text">
    //             <b>Phone : </b>
    //             {doctor.phoneNumber}
    //           </p>
    //           <p className="normal-text">
    //             <b>Address : </b>
    //             {doctor.address}
    //           </p>
    //           <p className="normal-text">
    //             <b>fee per visit : </b>
    //             {doctor.feePerConsultation}
    //           </p> */}
    //           {/* <p className="card-text">
    //             <b>Schedule : </b>
    //             {doctor.schedule[0]} - {doctor.schedule[1]}
    //           </p> */}
    //           {/* </div> */}
    //         </Col>
    //       </Row>

    //     </div>
    //   )}
    // </Layout>

    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">
            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg"
                alt=""
                width="100%"
                height="400"
              />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Schedule :</b> {doctor.schedule[0]} - {doctor.schedule[1]}
              </h1>
              <p>
                <b>Phone Number : </b>
                {doctor.phoneNumber}
              </p>
              <p>
                <b>Address : </b>
                {doctor.address}
              </p>
              <p>
                <b>Fee per Visit : </b>
                {doctor.feePerCunsultation}
              </p>
              <p>
                <b>Website : </b>
                {doctor.website}
              </p>
              <div className="d-flex flex-column pt-2 mt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setAvailable(false);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setAvailable(false);
                    setTime(moment(value).format("HH:mm"));
                  }}
                />
                {!isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={checkAvailability}
                  >
                    Check Availability
                  </Button>
                )}

                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
