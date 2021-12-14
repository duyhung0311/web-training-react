import React, { useEffect, useState } from "react";
import "./style.css";
import { Form, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faCheck,
  faTachometerAlt,
  faUser,
  faIdBadge,
  faShippingFast,
  faAddressCard,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import userApi from "../../api/userApi";
import jwt_decode from "jwt-decode";
function Menu() {
  const [form] = Form.useForm();

  const [currentTheme, setCurrentTheme] = useState();
  const [currentTheme_, setCurrentTheme_] = useState("");
  function checkUserData() {
    const item = JSON.parse(localStorage.getItem("jwt_Token"));
    let decodedToken = jwt_decode(item);
    const searchById = () => {
      const fetchGetById = async () => {
        try {
          const response = await userApi.getId(decodedToken._id);
          console.log("Id successfully", response.data.data.user);
          console.log("Admin", JSON.stringify(response.data.data.user.isAdmin));
          if (item) {
            setCurrentTheme(response.data.data.user.name);
            setCurrentTheme_(JSON.stringify(response.data.data.user.isAdmin));
          }
        } catch (error) {}
      };
      fetchGetById();
    };
    searchById();
  }
  useEffect(() => {
    window.addEventListener("storage", checkUserData);
    window.dispatchEvent(new Event("storage"));
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
                    <div style={{ color: "white" }}>{currentTheme}</div>
                  </Form.Item>
                </div>
                <div style={{ display: "flex", paddingTop: "10px" }}>
                  <FontAwesomeIcon color="white" size="2x" icon={faCheck} />
                  <Form.Item
                    name="name"
                    style={{ paddingLeft: "10px", fontSize: "18px" }}
                  >
                    {/* <div>{currentTheme_}</div> */}
                    {currentTheme_ === "false" ? (
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
