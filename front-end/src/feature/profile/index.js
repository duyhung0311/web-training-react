import React, { useState, useEffect } from "react";
import "./style.css";
import Menu from "../../components/menu";
import { Form, Input, Radio,Popconfirm } from "antd";
import authApi from "./../../api/authApi";
import {useNavigate}from 'react-router-dom'
function Profile() {
  const [value, setValue] = React.useState(1);
  const [value_, setValue_] = React.useState(2);
  const navigate = useNavigate()
  
  var arr = [];
  const [form] = Form.useForm();
  const getProfile = async () => {
    try {
      const response = await authApi.profile();
      console.log("Get profile successfully", response.data.data.user);
      arr.push(response.data.data.user);
      form.setFieldsValue(response.data.data.user);
      return arr;
    } catch (error) {}
  };
  useEffect(() => {
    getProfile();
  }, []);
   const onConfirm = () => {
     let removeToken = authApi.doLogout()
     if (removeToken == null) {
       localStorage.clear();
       navigate("/");
     }
   };
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const onChange_ = (e) => {
    console.log("radio checked", e.target.value);
    setValue_(e.target.value);
  };
  return (
    <div>
      <div className="container">
        <div className="left-side">
          <Menu />
        </div>
        <div className="right-side">
          <div className="inner-topic">
            <div className="flex-center-right-side">
              <p>PROFILE MANAGEMENT</p>
            </div>
            <div className="exit-icon">
              <div>
                <Popconfirm
                  title="Are you sure to delete this task?"
                  onConfirm={onConfirm}
                  okText="Yes"
                  cancelText="No"
                >
                  <div className="logout" href="#">
                    Logout
                  </div>
                </Popconfirm>
              </div>
            </div>
          </div>
          <div className="container-btn">
            <div style={{ margin: "0 auto" }}>
              <Form form={form} name="basic" initialValues={{ remember: true }}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                    {
                      type: "email",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item label="Is Admin?" name="isAdmin">
                  <Radio.Group onChange={onChange} value={value} disabled>
                    <Radio value={true}>True</Radio>
                    <Radio value={false}>False</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Is Active?" name="isActive">
                  <Radio.Group onChange={onChange_} value={value} disabled>
                    <Radio value={true}>True</Radio>
                    <Radio value={false}>False</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
