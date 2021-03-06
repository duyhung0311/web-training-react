import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";
import {
  Button,
  Table,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  message,
  DatePicker,
  Select,
  notification,
  Spin,
  Popconfirm,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import contactApi from "../../api/contactApi";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import authApi from "../../api/authApi";
function Contact(props) {
  let arrKey = [];
  const params = useParams();
  const navigate = useNavigate();
  const [listContact, setListContact] = useState([]);
  const [stateUser, setStateUser] = useState([]);
  const [isloadingUpdate, setIsloadingUpdate] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [dataModal, setDataModal] = useState({});
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [form] = Form.useForm();
  const [form_edit] = Form.useForm();
  const [selectionType, setSelectionType] = useState("checkbox");
  const typingTimeout = useRef(null);
  useEffect(() => {
    // fetchContactList();
    fetchUserList();
    // console.log(params);
    filterJoint();
  }, []);
  const openModal_Create = () => {
    setModalCreate(true);
    form.resetFields();
  };
  const onConfirm = () => {
    const removeToken = authApi.doLogout();
    if (removeToken == null) {
      localStorage.clear();
      navigate("/login");
    }
  };
  const [dataAfter, setDataAfter] = useState({
    birthday: "",
  });
  const openModal_Edit = (values) => {
    setModalEdit(true);
    values = { ...values, dob: moment(values.dob) };
    console.log(values);
    form_edit.setFieldsValue(values);
    setDataModal(values);
  };
  const handleCancel_createContact = () => {
    setModalCreate(false);
  };
  const handleCancel_editContact = () => {
    setModalEdit(false);
    form_edit.resetFields();
  };
  const fetchDeleteContacts = async (record) => {
    try {
      console.log(record);
      const response = await contactApi.delete(record._id);
      console.log("Delete contract successfully", response);
      notification.success({
        message: `Delete contact successfully`,
        icon: <CheckOutlined style={{ color: "#108ee9" }} />,
        placement: "topRight",
      });
      fetchContactList();
    } catch (error) {
      console.log("Failed to delete contact list", error);
    }
  };
  const fetchEditContact = async (id, data) => {
    try {
      setIsloadingUpdate(true);
      const response = await contactApi.edit(id, data);
      console.log("Fetch update contact successfully:", response);
      setListContact([...listContact, response]);
      fetchContactList();
      notification.success({
        message: `Edit contact successfully`,
        icon: <CheckOutlined style={{ color: "#108ee9" }} />,
        placement: "topRight",
      });
      setModalEdit(false);
    } catch (error) {
      setIsloadingUpdate(false);
      console.log(error);
    }
  };
  const onFinish_editContact = (values) => {
    const result = {
      ...values,
      dob: values["dob"].format("YYYY-MM-DD"),
    };
    console.log("<<<result", result);
    fetchEditContact(dataModal._id, result);
  };
  const onFinish_createContact = (values) => {
    console.log(values);
    console.log(values["dob"].format("YYYY-MM-DD"));
    const variable = values["dob"].format("YYYY-MM-DD");
    var start = moment(variable);
    console.log(start);
    const result = {
      ...values,
      dob: values["dob"].format("YYYY-MM-DD"),
    };
    const fetchCreateContact = async () => {
      try {
        setIsloadingUpdate(true);
        const response = await contactApi.post(result);
        console.log("Fetch create contact successfully: ", response);
        setListContact([...listContact, response]);
        fetchContactList();
        notification.success({
          message: `Create contact successfully`,
          icon: <CheckOutlined style={{ color: "#108ee9" }} />,
          placement: "topRight",
        });
        form.resetFields();
        setModalCreate(false);
      } catch (error) {
        setIsloadingUpdate(false);
        console.log(error);
      }
    };
    fetchCreateContact();
  };
  const onFinish_DeleteAll = (values) => {
    console.log(values);
    const fetchDeleteAll = async () => {
      try {
        console.log(values);
        const response = await contactApi.deleteMultiple(values);
        console.log("Delete multiple contacts successfully", response);
        fetchContactList();
        notification.success({
          message: `Delete  multiple contacts successfully`,
          icon: <CheckOutlined style={{ color: "#108ee9" }} />,
          placement: "topRight",
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeleteAll();
  };
  const functionSearch = async (e) => {
    try {
      const response = await contactApi.search(e);
      console.log("Search successfully", response);
      setListContact(response.data.data.contacts);
    } catch (error) {}
  };
  const handleSearch = (e) => {
    // console.log(e.target.value)
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => {
      console.log(e);
      e === "" ? fetchContactList() : functionSearch(e);
    }, 300);
  };
  const onFinish_deleteAllContact = (values) => {
    values = arrKey._id;
    console.log(values);
    values === undefined
      ? message.warning(
          "Please choose list contact so that the website can perform delete all function!!!"
        )
      : onFinish_DeleteAll(values);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      let arrKey1 = [];
      arrKey = { ...arrKey1, _id: selectedRowKeys };
      console.log(arrKey);
    },
  };
  const cancelConfirm = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  const filterJoint = (values) => {
    // console.log(values);
    if (values === undefined) {
      // console.log("1");
      fetchContactList();
    }
    if (values) {
      navigate("/contact");
    }
    const filtered = async () => {
      try {
        console.log(values);
        const token = JSON.parse(localStorage.getItem("jwt_Token"));
        // console.log("<<<<", token);
        const response = await contactApi.getAll(token);
        const result = response.data.data.contacts.filter(
          (contacts) =>
            values === undefined && Object.keys(params).length===0 ?
            //  console.log("1")
             contacts
             : 
            //  console.log("2")
           contacts.leadSrc === params.leadSourceValue ||
            contacts.assignedTo === params.assignedValue ||
            contacts.leadSrc === values ||
            contacts.assignedTo === values
        );
        console.log(result);
        setListContact(result);
      } catch (error) {}
    };
    filtered();
  };
  const handleChange_filterLeadSrc = (value) => {
    console.log(value);
    value === undefined ? fetchContactList() : filterJoint(value);
  };
  const handleChange_filterAssignedTo = (value) => {
    console.log(`selected ${value}`);
    value === undefined ? fetchContactList() : filterJoint(value);
  };
  const fetchContactList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("jwt_Token"));
      console.log("<<<<token contact1123", token);
      const response = await contactApi.getAll(token);
      // console.log("api get contact all", response);
      const variable = localStorage.getItem("user");
      const result = response.data.data.contacts.filter(
        (contacts) => contacts.assignedTo === variable
      );
      setStateUser(result);
      console.log(">>response.data.data.contacts", response.data.data.contacts);
      setListContact(response.data.data.contacts);
      setIsloadingUpdate(false);
    } catch (error) {
      console.log("Failed to fetch contacts list: ", error);
    }
  };
  const fetchUserList = async () => {
    try {
      const response = await userApi.getAll();
      // console.log("Fetch list user successfully: ", response);
      setListUser(response.data.data.users);
    } catch (error) {
      console.log("Failed to fetch users list: ", error);
    }
  };
  const columns = [
    {
      title: "Creator",
      dataIndex: "creator",
    },
    {
      title: "Contact Name",
      dataIndex: "contactName",
    },
    {
      title: "Mobile Phone",
      dataIndex: "mobilePhone",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
    },
    {
      title: "Lead Source",
      dataIndex: "leadSrc",
    },
    {
      title: "Assigned to",
      dataIndex: "assignedTo",
    },
    {
      title: "Actions",
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
          <div style={{ paddingLeft: "10px", lineHeight: "1px" }}>
            <Popconfirm
              title="B???N C?? CH???C MU???N X??A D??? LI???U KH??NG?"
              onCancel={cancelConfirm}
              onConfirm={() => fetchDeleteContacts(record)}
            >
              <FontAwesomeIcon icon={faTrashAlt} color="#ff2400" />
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div>
      {/* Modal Create Contact */}
      <Modal
        title="Modal Create User"
        visible={modalCreate}
        footer={null}
        // onOk={handleCancel_createUser}
      >
        <Form form={form} onFinish={onFinish_createContact}>
          <Form.Item
            label="Contact Name"
            name="contactName"
            rules={[
              { required: true, message: "Please input your contact name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Salutation"
            name="salutation"
            rules={[{ required: true, message: "Please tick salutation!" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="None">None</Radio>
                <Radio value="Mr">Mr</Radio>
                <Radio value="Mrs">Mrs</Radio>
                <Radio value="Ms">Ms</Radio>
                <Radio value="Dr">Dr</Radio>
                <Radio value="Prof">Prof</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Mobile Phone"
            name="mobilePhone"
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
            label="Organization"
            name="organization"
            rules={[
              { required: true, message: "Please input your organization!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: "Please tick date of birth!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Lead Source"
            name="leadSrc"
            rules={[{ required: true, message: "Please input lead source!" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="Existing Customer">Existing Customer</Radio>
                <Radio value="Partner">Partner</Radio>
                <Radio value="Conference">Conference</Radio>
                <Radio value="Website">Website</Radio>
                <Radio value="Word of Mouth">Word of Mouth</Radio>
                <Radio value="Other">Other</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Assigned To"
            name="assignedTo"
            rules={[{ required: true, message: "Please enter assigned to!" }]}
          >
            <Select>
              {listUser.map((userId) => (
                <Select.Option key={userId.username} value={userId.username}>
                  {userId.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Creator"
            name="creator"
            rules={[{ required: true, message: "Please enter creator!" }]}
          >
            <Select>
              {listUser.map((userId) => (
                <Select.Option key={userId.username} value={userId.username}>
                  {userId.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter your description!" },
            ]}
          >
            <Input />
          </Form.Item>
          <div style={{ display: "flex" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: "8px" }}
            >
              Th??m m???i{" "}
            </Button>
            <div style={{ paddingLeft: "10px" }}>
              <Button
                type="default"
                onClick={handleCancel_createContact}
                style={{ borderRadius: "8px" }}
              >
                H???Y B???
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
      {/* Modal Edit Contact */}
      <Modal
        title="Modal Edit User"
        visible={modalEdit}
        footer={null}

        // onOk={handleCancel_createUser}
      >
        <Spin spinning={isloadingUpdate} size="large">
          <Form
            form={form_edit}
            initialValues={{ remember: true }}
            onFinish={onFinish_editContact}
          >
            <Form.Item
              label="Contact Name"
              name="contactName"
              rules={[
                { required: true, message: "Please input your contact name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Salutation"
              name="salutation"
              rules={[{ required: true, message: "Please tick salutation!" }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="None">None</Radio>
                  <Radio value="Mr">Mr</Radio>
                  <Radio value="Mrs">Mrs</Radio>
                  <Radio value="Ms">Ms</Radio>
                  <Radio value="Dr">Dr</Radio>
                  <Radio value="Prof">Prof</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Mobile Phone"
              name="mobilePhone"
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
              label="Organization"
              name="organization"
              rules={[
                { required: true, message: "Please input your organization!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[
                { required: true, message: "Please tick date of birth!" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                onChange={(date, dateString) =>
                  setDataAfter({ ...dataAfter, birthday: dateString })
                }
              />
            </Form.Item>

            <Form.Item
              label="Lead Source"
              name="leadSrc"
              rules={[{ required: true, message: "Please input lead source!" }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="Existing Customer">Existing Customer</Radio>
                  <Radio value="Partner">Partner</Radio>
                  <Radio value="Conference">Conference</Radio>
                  <Radio value="Website">Website</Radio>
                  <Radio value="Word of Mouth">Word of Mouth</Radio>
                  <Radio value="Other">Other</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Assigned To"
              name="assignedTo"
              rules={[{ required: true, message: "Please enter assigned to!" }]}
            >
              <Select>
                {listUser.map((userId) => (
                  <Select.Option key={userId.username} value={userId.username}>
                    {userId.username}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Creator"
              name="creator"
              rules={[{ required: true, message: "Please enter creator!" }]}
            >
              <Select>
                {listUser.map((userId) => (
                  <Select.Option key={userId.username} value={userId.username}>
                    {userId.username}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please enter your address!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter your description!" },
              ]}
            >
              <Input />
            </Form.Item>
            <div style={{ display: "flex" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ borderRadius: "8px" }}
              >
                Ch???nh s???a{" "}
              </Button>
              <div style={{ paddingLeft: "10px" }}>
                <Button
                  type="default"
                  onClick={handleCancel_editContact}
                  style={{ borderRadius: "8px" }}
                >
                  H???Y B???
                </Button>
              </div>
            </div>
          </Form>
        </Spin>
      </Modal>
      <div className="inner-topic">
        <div className="flex-center-right-side">
          <p>CONTACTS MANAGEMENT</p>
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
          {localStorage.getItem("admin") === "false" ? (
            <div style={{ display: "flex" }}>
              {" "}
              <Button
                type="primary"
                className="btn-create"
                onClick={openModal_Create}
              >
                {" "}
                Create
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              <Button
                type="primary"
                className="btn-create"
                onClick={openModal_Create}
              >
                {" "}
                Create
              </Button>
              <button
                className="btn-delete-all"
                onClick={() => onFinish_deleteAllContact()}
              >
                Delete
              </button>
              <Select
                allowClear
                size="medium"
                // defaultValue={location.state.user}
                placeholder="Select Assigned To"
                className="selectAssignedTo"
                onChange={handleChange_filterAssignedTo}
                defaultValue={params.assignedValue}
              >
                {listUser.map((us) => (
                  <Select.Option key={us.username} value={us.username}>
                    {us.username}
                  </Select.Option>
                ))}
              </Select>
              <Select
                allowClear
                size="medium"
                placeholder="Select Lead Source"
                className="selectLeadSource"
                onChange={handleChange_filterLeadSrc}
                defaultValue={params.leadSourceValue}
              >
                <Select.Option value="Existing Customer">
                  Existing Customer
                </Select.Option>
                <Select.Option value="Partner">Partner </Select.Option>
                <Select.Option value="Conference">Conference </Select.Option>
                <Select.Option value="Website">Website </Select.Option>
                <Select.Option value="Word of Mouth">
                  Word of Mouth{" "}
                </Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
              <Input.Search
                placeholder="Search contact name"
                className="searchContact"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      <div className="container-btn">
        {localStorage.getItem("admin") === "false" ? (
          /* Table User */
          <Table
            style={{ width: "100%" }}
            dataSource={listContact}
            columns={columns}
            bordered
            rowKey="_id"
          />
        ) : (
          <Table
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            style={{ width: "100%" }}
            dataSource={listContact}
            columns={columns}
            bordered
            rowKey="_id"
          />
        )}
        ;
      </div>
    </div>
  );
}

export default Contact;
