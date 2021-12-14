import React from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Form, Input, notification } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import authApi from "../../api/authApi";
import userApi from "../../api/userApi";
function Login(props) {
  localStorage.setItem("check", "false");
  let navigate = useNavigate();
  const searchById = (values) => {
    const fetchGetById = async () => {
      try {
        const response = await userApi.getId(values);
        // console.log("Get by id successfully", response.data.data.user);
        localStorage.setItem("_id", response.data.data.user._id);
        localStorage.setItem("admin", response.data.data.user.isAdmin);
        localStorage.setItem("user", response.data.data.user.username);
        localStorage.setItem("name", response.data.data.user.name);
      } catch (error) {}
    };
    fetchGetById();
  };
  const onFinish = (values) => {
    const login = async () => {
      try {
        console.log("Success:", values);
        const response = await authApi.login(values);
        // console.log("Fetch login user successfully: ", response);
        // fakeAuth.login(() => {
        //   navigate(from);
        // });
        localStorage.setItem("check", "true");
        notification.success({
          message: "Đăng nhập thành công",
          icon: <CheckCircleFilled style={{ color: "#20da9b" }} />,
          description: `Tài khoản ${values.username} đăng nhập thành công`,
          placement: "topRight",
        });
        let decodedToken = jwt_decode(response.data.data.token);
        // console.log(decodedToken);
        localStorage.setItem(
          "jwt_Token",
          JSON.stringify( response.data.data.token )
        );
        searchById(decodedToken._id);
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    };
    login();
  };
  // const { from } = props.location.state || { from: { pathname: "/contact" } };
  // const { redirectToReferrer } = Directstate;
  // if (redirectToReferrer === true) {
  //   return <Navigate to={from} />;
  // }
  return (
    <div>
      <div className="box">
        <div className="inner-box">
          <div className="design-flex">
            <FontAwesomeIcon icon={faLock} className="icon" size="6x" />
          </div>
          <div className="design-flex text-login">ACCOUNT LOGIN</div>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            className="example-form"
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/* Topic username */}
            <div>
              <div className="text-input">USERNAME</div>
            </div>
            {/* Content input username */}
            <div className="text-input detailed-input">
              <Form.Item
                // label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            {/* Topic username */}
            <div>
              <div className="text-input">PASSWORD</div>
            </div>
            {/* Content input password */}
            <div className="text-input detailed-input">
              <Form.Item
                //   label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </div>
            <div style={{ backgroundColor: "#179cae" }}>
              <button className="btn-login text-detailed-input">LOGIN</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
