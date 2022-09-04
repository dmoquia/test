import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import axios from "axios";

import { Table } from "antd";
import moment from "moment";
import toast from "react-hot-toast";
function DoctorAppointments() {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);
  console.log(appointments);
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get(
        // "/api/user/get-appointments-by-user-id",
        "/api/doctor/get-appointments-by-doctor-id",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  //heere
  // const changedDoctorStatus = async (record, status) => {
  const changedAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        // "/api/admin/change-doctor-status",
        "/api/doctor/change-appointment-status",
        // { doctorId: record._id, userId: record.userId, status: status },
        {
          appointmentId: record._id,
          status: status,
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
        // getDoctorsList();
        getAppointmentsData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error changing the status");

      dispatch(hideLoading());
    }
  };
  //here
  useEffect(() => {
    getAppointmentsData();
  }, []);
  const columns = [
    {
      title: "id",
      dataIndex: "_id",
    },

    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => (
        <span key={record._id}>{record.userInfo.name}</span>
      ),
    },

    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <span key={record._id}>{record.doctorInfo.phoneNumber}</span>
      ),
    },

    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span key={record._id}>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "status",
      dataIndex: "status",
    },
    //here
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex ">
              <h1
                className="anchor px-2"
                // onClick={() => changedDoctorStatus(record, "approved")}
                onClick={() => changedAppointmentStatus(record, "approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor"
                // onClick={() => changedDoctorStatus(record, "blocked")}
                onClick={() => changedAppointmentStatus(record, "rejected")}
              >
                {/* Block */}
                Reject
              </h1>
            </div>
          )}
          {/* {record.status === "approved" && ()} */}
        </div>
      ),
    },
    //here
  ];

  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <hr />
      <Table
        columns={columns}
        dataSource={appointments}
        rowKey={(item) => item._id}
      />
    </Layout>
  );
}

export default DoctorAppointments;
