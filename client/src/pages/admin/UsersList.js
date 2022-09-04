import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";
function UsersList() {
  const [users, setUser] = useState([]);
  const dispatch = useDispatch();

  const getUsersList = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/admin/get-all-users",
        // {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getUsersList();
  }, []);

  const columns = [
    {
      title: "name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => moment(record.createdAt).format("MMMM DD YYYY"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-title">users list</h1>
      <hr />
      <Table columns={columns} dataSource={users} rowKey={(item) => item._id} />
    </Layout>
  );
}

export default UsersList;
