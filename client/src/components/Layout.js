import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../layout.css";
import { Badge } from "antd";

function Layout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const userMenu = [
    { id: 0, name: "Home", path: "/", icon: "ri-home-line" },
    {
      id: 1,
      name: "Appointents",
      path: "/appointments",
      icon: "ri-file-list-line",
    },
    {
      id: 2,
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
    },
    // { id: 3, name: "Profile", path: "/profile", icon: "ri-profile-line" },
  ];
  const doctorMenu = [
    { id: 0, name: "Home", path: "/", icon: "ri-home-line" },
    {
      id: 1,
      name: "Appointents",
      // path: "/appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },

    {
      id: 3,
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-profile-line",
    },
  ];

  const adminMenu = [
    { id: 0, name: "Home", path: "/", icon: "ri-home-line" },
    {
      id: 1,
      name: "Users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      id: 2,
      name: "Doctor",
      path: "/admin/doctorslist",
      icon: "ri-user-heart-line",
    },
    {
      id: 3,
      name: "Profile",
      path: "/profile",
      icon: "ri-account-circle-line",
    },
    // {
    //   id: 4,
    //   name: "Logout",
    //   path: "/logout",

    //   icon: "ri-logout-box-line",
    // },
  ];

  const menuToRender = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="logo">dm</h1>
            <h1 className="normal-text role">{role}</h1>
          </div>
          <div className="menu">
            {menuToRender?.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={menu.id}
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <i className={menu.icon} />
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div className="d-flex menu-item" onClick={logout}>
              <i className="ri-logout-box-line" />
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-2-line header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unSeenNotification.length}
                onClick={() => navigate("/notifications")}
              >
                <i className="ri-notification-line header-action-icon px-3" />
              </Badge>
              <Link to="/profile" className="anchor ">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
