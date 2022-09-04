import { Tabs } from "antd";
import React from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/alertSlice";
import { setUser } from "../redux/userSlice";
import toast from "react-hot-toast";
function Notifications() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const markAllSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/mark-all-notification-as-seen",
        //values
        { userId: user._id },
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
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };
  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/delete-all-notification",
        //values
        { userId: user._id },
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
        dispatch(setUser(response.data.data));
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
      <h1>notification</h1>
      <Tabs>
        <Tabs.TabPane tab="Unseen" key={0}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={() => markAllSeen()}>
              Mark all as seen
            </h1>
          </div>
          {user?.unSeenNotification.map((notification, index) => (
            <div
              className="card p-2 mt-2"
              key={index}
              onClick={() => navigate(notification.onClickPath)}
            >
              <div className="card-text">{notification.msg}</div>
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="seen" key={1}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={deleteAll}>
              Delete all
            </h1>
          </div>
          {user?.seenNotification.map((notification, index) => (
            <div
              className="card p-2 mt-2"
              key={index}
              onClick={() => navigate(notification.onClickPath)}
            >
              <div className="card-text">{notification.msg}</div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
}

export default Notifications;
