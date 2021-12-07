import React, { useEffect } from "react";
import "./style.css";
import { Form, Input, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faPhone,
  faCheck,
  faTachometerAlt,
  faUser,
  faIdBadge,
  faShippingFast,
  faAddressCard,
  faUnlock,
  faUserLock,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import authApi from "../../api/authApi";
import { Routes, Route, Link, Outlet } from "react-router-dom";

function Menu() {
  const [form] = Form.useForm();
  const getProfile = async () => {
    try {
      const response = await authApi.profile();
      console.log("Get profile successfully", response.data.data.user);
      form.setFieldsValue(response.data.data.user);
      // localStorage.setItem("key", response.data.data.user.isAdmin);
    } catch (error) {}
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div>
      <div className="menu">
        <div style={{ display: "block", width: "100%" }}>
          <div className="topic-menu">
            <div className="left-topic-menu">Web CRM</div>
          </div>
          <div className="function">
            <div className="inner-img">
              <img
                src="https://png.pngtree.com/png-vector/20190525/ourlarge/pngtree-man-avatar-icon-professional-man-character-png-image_1055448.jpg"
                alt="Avatar account"
                className="img-ava"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="content-info">
              <Form form={form}>
                <div style={{ display: "flex" }}>
                  <FontAwesomeIcon
                    size="2x"
                    color="white"
                    icon={faUserCircle}
                  />
                  <Form.Item
                    name="username"
                    style={{ paddingLeft: "10px", fontSize: "18px" }}
                  >
                    <div style={{ color: "white" }}>
                      {localStorage.getItem("name")}
                    </div>
                  </Form.Item>
                </div>
                <div style={{ display: "flex", paddingTop: "10px" }}>
                  <FontAwesomeIcon color="white" size="2x" icon={faCheck} />
                  <Form.Item
                    name="name"
                    style={{ paddingLeft: "10px", fontSize: "18px" }}
                  >
                    {localStorage.getItem("admin") === "false" ? (
                      <Tag color="#2db7f5">User</Tag>
                    ) : (
                      <Tag color="#87d068">Admin</Tag>
                    )}
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
          <div className="general">
            <div className="title-general">General</div>
            <div className="container-general">
              <div className="inline-element-menu">
                <Link to="/dashboard" style={{ display: "flex" }}>
                  <div className="icon-general">
                    <FontAwesomeIcon size="2x" icon={faTachometerAlt} />
                  </div>
                  <div className="content-general">
                    <p style={{ marginLeft: "5px" }}>Dashboard</p>
                  </div>
                </Link>
              </div>
              <div className="inline-element-menu">
                {localStorage.getItem("admin") === "false" ? (
                  <></>
                ) : (
                  <>
                    <Link to="/user" style={{ display: "flex" }}>
                      <div className="icon-general">
                        <FontAwesomeIcon size="2x" icon={faUser} />
                      </div>
                      <div className="content-general">
                        <p>User Management</p>
                      </div>
                    </Link>
                  </>
                )}
              </div>
              <div className="inline-element-menu">
                <Link to="/contact" style={{ display: "flex" }}>
                  <div className="icon-general">
                    <FontAwesomeIcon size="2x" icon={faIdBadge} />
                  </div>
                  <div className="content-general">
                    <p style={{ marginLeft: "7px" }}>Contact</p>
                  </div>
                </Link>
              </div>
              <div className="inline-element-menu">
                <Link to="/sales-order" style={{ display: "flex" }}>
                  <div className="icon-general">
                    <FontAwesomeIcon size="2x" icon={faShippingFast} />
                  </div>
                  <div className="content-general">
                    <p>Sales Order</p>
                  </div>
                </Link>
              </div>
              <div className="inline-element-menu">
                <Link to="/profile" style={{ display: "flex" }}>
                  <div className="icon-general">
                    <FontAwesomeIcon size="2x" icon={faAddressCard} />
                  </div>
                  <div className="content-general">
                    <p>User Profile</p>
                  </div>
                </Link>
              </div>
              <div className="inline-element-menu">
                <Link to="/password" style={{ display: "flex" }}>
                  <div className="icon-general">
                    <FontAwesomeIcon size="2x" icon={faUnlock} />
                  </div>
                  <div className="content-general">
                    <p>Password</p>
                  </div>
                </Link>
              </div>
              <div style={{ paddingTop: "36px", fontSize: "18px" }}>
                Created by team SRC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
