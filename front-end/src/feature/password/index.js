import React from "react";
import "./style.css";
import Menu from "../../components/menu";
import { Form, Input, Button, Popconfirm, message, notification } from "antd";
import authApi from "./../../api/authApi";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";
import userApi from "../../api/userApi";
function Password() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onConfirm = () => {
    let removeToken = authApi.doLogout();
    if (removeToken == null) {
      localStorage.clear();
      navigate("/");
    }
  };
  const onSubmit = async (_id, data) => {
    try {
      const response = await userApi.password(_id, data);
      console.log("Success changed", response);
      notification.success({
        message: "Thay đổi mật khẩu thành công",
        icon: <CheckCircleFilled style={{ color: "#20da9b" }} />,
        description: `Tài khoản ${localStorage.getItem(
          "user"
        )} đăng nhập thành công`,
        placement: "topRight",
      });
      form.resetFields();
      authApi.doLogout()
    } catch (error) {}
  };
  const changePassword = (values) => {
    console.log(values);
    console.log(values.oldPass !== values.confirmPass);
    const _id = localStorage.getItem("_id");
    console.log(_id);
    if (values.oldPass !== values.confirmPass) {
      message.error("Confirmation old password is wrong!!");
    } else if (values.oldPass === values.newPass) {
      message.error("New and old password is not similar!!");
    } else onSubmit(_id, values.newPass);
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
              <p>PASSWORD MANAGEMENT</p>
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
              <Form
                form={form}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={changePassword}
              >
                <Form.Item
                  label="Old Password"
                  name="oldPass"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Confirmation Password"
                  name="confirmPass"
                  rules={[
                    {
                      required: true,
                      message: "Please input your old password again!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="New Password"
                  name="newPass"
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Password;
