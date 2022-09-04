import React from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/login", values);
      console.log(response);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.msg);
        toast("Redirecting to Home page");
        localStorage.setItem("token", response.data.data);
        navigate("/");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };

  React.useEffect(() => {
    // if the token has user then we will redirect them to homepage
    const user = localStorage.getItem("token");
    if (user) {
      return navigate("/");
    }
  });
  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Welcome back</h1>
        <Form layout="vertical" onFinish={onFinish}>
          {/* <Form.Item label="Name" name="name">
            <Input placeholder="Name" />
          </Form.Item> */}
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Button
            className="primary-button my-2 full-width-button"
            htmlType="submit"
          >
            Login
          </Button>
          <Link to="/register" className="anchor ">
            click here to register
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;
