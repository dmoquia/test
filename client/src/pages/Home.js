import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
function Home() {
  const [doctors, setDoctor] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.get(
        // replace the method to 'get'
        "/api/user/get-all-approved-doctors", // endpoint
        // {}, <- remove the payload
        {
          // headers
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  // return <div>Home</div>;
  return (
    <Layout>
      <Row gutter={20}>
        {doctors?.map((doctor) => (
          <Col key={doctor._id} span={8} xs={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Home;
