import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { Table } from "antd";
import moment from "moment";
function DoctorsList() {
  const dispatch = useDispatch();
  const [doctors, setDoctor] = useState([]);

  const getDoctorsList = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/admin/get-all-doctors",
        // {},
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
  const changedDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-doctor-status",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.msg);
        getDoctorsList();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error changing the status");

      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getDoctorsList();
  }, []);

  const columns = [
    {
      key: 0,
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span key={record._id}>
          {record.firstName} {record.lastName}
        </span>
      ),
    },

    {
      key: 1,
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      key: 2,
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => moment(record.createdAt).format("MMMM DD YYYY"),
    },
    {
      key: 3,
      title: "status",
      dataIndex: "status",
    },
    {
      key: 4,
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <h1
              className="anchor"
              onClick={() => changedDoctorStatus(record, "approved")}
            >
              Approve
            </h1>
          )}
          {record.status === "approved" && (
            <h1
              className="anchor"
              onClick={() => changedDoctorStatus(record, "blocked")}
            >
              Block
            </h1>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-header">doctors list</h1>
      <hr />
      <Table
        columns={columns}
        dataSource={doctors}
        rowKey={(item) => item._id}
      />
    </Layout>
  );
}

export default DoctorsList;
