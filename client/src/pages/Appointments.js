import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
import axios from "axios";

import { Table } from "antd";
import moment from "moment";
function Appointments() {
  const dispatch = useDispatch();
  // const [doctors, setDoctor] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get(
        // "/api/admin/get-all-doctors",
        "/api/user/get-appointments-by-user-id",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        // setDoctor(response.data.data);
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    // getDoctorsList();
    getAppointmentsData();
  }, []);
  const columns = [
    {
      title: "id",
      dataIndex: "_id",
    },

    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span key={record._id}>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
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
  ];
  // return <div>Appointments</div>;
  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
      <hr />
      <Table
        columns={columns}
        // dataSource={doctors}
        dataSource={appointments}
        rowKey={(item) => item._id}
      />
    </Layout>
  );
}

export default Appointments;
