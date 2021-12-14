import {
  Button,
  Modal,
  Table,
  Form,
  Input,
  Radio,
  notification,
  message,
  Popconfirm,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import "./style.css";
import userApi from "../../api/userApi";
import { CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
function User (){
  const [listUser, setListUser] = useState([]);
  const navigate = useNavigate();
  const [modalCreate, setModalCreate] = useState(false);
  const [dataModal, setDataModal] = useState({});
  const [modalEdit, setModalEdit] = useState(false);
  const [form] = Form.useForm();
  const [form_edit] = Form.useForm();
  const onConfirm = () => {
    let removeToken = authApi.doLogout();
    if (removeToken == null) {
      localStorage.clear();
      navigate("/login");
    }
  };
  const openModal_Create = () => {
    setModalCreate(true);
  };
  const openModal_Edit = (values) => {
    setModalEdit(true);
    form_edit.setFieldsValue(values);
    setDataModal(values);
    console.log(values._id);
  };
  const handleCancel_createUser = () => {
    setModalCreate(false);
  };
  const handleCancel_editUser = () => {
    setModalEdit(false);
  };
  const fetchUserList = async () => {
    try {
      const response = await userApi.getAll();
      console.log("Fetch list user successfully: ", response.data.data.users);
      setListUser(response.data.data.users);
    } catch (error) {
      console.log("Failed to fetch users list: ", error);
    }
  };
  useEffect(() => {
    fetchUserList();
  }, []);
  const columns = [
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "x",
      render: (text, record) => (
        <div style={{ display: "flex" }}>
          <div
            style={{ paddingLeft: "10px", lineHeight: "1px" }}
            onClick={() => {
              openModal_Edit(record);
            }}
          >
            <FontAwesomeIcon icon={faEdit} color="#7fc241" />
          </div>
        </div>
      ),
    },
  ];
  const fetchEditUser = async (id, data) => {
    try {
      const response = await userApi.edit(id, data);
      console.log("Fetch update user successfully:", response);
      setListUser([...listUser, response]);
      fetchUserList();
      notification.warning({
        message: `Edit user successfully`,
        icon: <CheckOutlined style={{ color: "#108ee9" }} />,
        placement: "topRight",
      });
      // form.resetFields();
      setModalEdit(false);
    } catch (error) {
      console.log(error);
    }
  };
  const onFinish_editUser = (values) => {
    console.log(values);
    const dataEdit = { id: dataModal._id, data: values };
    console.log(dataEdit);
    fetchEditUser(dataEdit.id, dataEdit.data);
  };
  const onFinish_createUser = (values) => {
    console.log(values);
    const fetchCreateUser = async () => {
      try {
        const response = await userApi.post(values);
        console.log("Fetch create user successfully: ", response);
        setListUser([...listUser, response]);
        fetchUserList();
        notification.warning({
          message: `Create user successfully`,
          icon: <CheckOutlined style={{ color: "#108ee9" }} />,
          placement: "topRight",
        });
        form.resetFields();
        setModalCreate(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCreateUser();
  };
  return (
    <div>
      {/* Modal Create User */}
      <Modal
        title="Modal Create User"
        visible={modalCreate}
        footer={null}
        // onOk={handleCancel_createUser}
      >
        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish_createUser}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone!" },
              {},
            ]}
          >
            <Input
              onChange={(e) => {
                const value = e.target.value;
                console.log(!isNaN(+value)); // true if its a number, false if not
                !isNaN(+value) === false ? (
                  message.warning("Data of this input must be a number")
                ) : (
                  <></>
                );
              }}
            />
          </Form.Item>
          <Form.Item
            label="IsAdmin"
            name="isAdmin"
            rules={[{ required: true, message: "Please tick isAdmin!" }]}
          >
            <Radio.Group>
              <Radio value={true}>True</Radio>
              <Radio value={false}>False</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="IsActive"
            name="isActive"
            rules={[{ required: true, message: "Please tick isActive!" }]}
          >
            <Radio.Group>
              <Radio value={true}>True</Radio>
              <Radio value={false}>False</Radio>
            </Radio.Group>
          </Form.Item>
          <div style={{ display: "flex" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: "8px" }}
            >
              Thêm mới{" "}
            </Button>
            <div style={{ paddingLeft: "10px" }}>
              <Button
                type="default"
                onClick={handleCancel_createUser}
                style={{ borderRadius: "8px" }}
              >
                HỦY BỎ
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
      {/* Modal Edit User */}
      <Modal
        title="Modal Edit User"
        visible={modalEdit}
        footer={null}
        // onOk={handleCancel_createUser}
      >
        <Form
          form={form_edit}
          initialValues={{ remember: true }}
          onFinish={onFinish_editUser}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone!" },
              {},
            ]}
          >
            <Input
              onChange={(e) => {
                const value = e.target.value;
                console.log(!isNaN(+value)); // true if its a number, false if not
                !isNaN(+value) === false ? (
                  message.warning("Data of this input must be a number")
                ) : (
                  <></>
                );
              }}
            />
          </Form.Item>
          <Form.Item
            label="IsAdmin"
            name="isAdmin"
            rules={[{ required: true, message: "Please tick isAdmin!" }]}
          >
            <Radio.Group>
              <Radio value={true}>True</Radio>
              <Radio value={false}>False</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="IsActive"
            name="isActive"
            rules={[{ required: true, message: "Please tick isActive!" }]}
          >
            <Radio.Group>
              <Radio value={true}>True</Radio>
              <Radio value={false}>False</Radio>
            </Radio.Group>
          </Form.Item>
          <div style={{ display: "flex" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: "8px" }}
            >
              Chỉnh sửa{" "}
            </Button>
            <div style={{ paddingLeft: "10px" }}>
              <Button
                type="default"
                onClick={handleCancel_editUser}
                style={{ borderRadius: "8px" }}
              >
                HỦY BỎ
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
      <div className="inner-topic">
        <div className="flex-center-right-side">
          <p>USER MANAGEMENT</p>
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
        <div style={{ display: "block" }}>
          <Button
            type="primary"
            className="btn-create"
            onClick={openModal_Create}
          >
            {" "}
            Create
          </Button>
        </div>
      </div>
      <div className="container-btn">
        <Table
          className="table"
          style={{ width: "100%" }}
          dataSource={listUser}
          columns={columns}
          rowKey="email"
        />
        ;
      </div>
    </div>
  );
};

export default User;
