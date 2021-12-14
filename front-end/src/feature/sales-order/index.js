import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Space,
  message,
  notification,
  Popconfirm,
} from "antd";
import salesApi from "./../../api/salesApi";
import usersApi from "./../../api/userApi";
import { CheckOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import authApi from "../../api/authApi";
function SalesOrder() {
  let arrKey = [];
  const params = useParams();
  const typingTimeout = useRef(null);
  const navigate = useNavigate();
  const [listSales, setListSales] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [stateUser, setStateUser] = useState([]);
  const [isloadingUpdate, setIsloadingUpdate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [dataModal, setDataModal] = useState({});
  const [form] = Form.useForm();
  const [form_edit] = Form.useForm();
  const [selectionType, setSelectionType] = useState("checkbox");
  const [modalCreate, setModalCreate] = useState(false);
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
  const onFinish_deleteAllSalesOrder = (values) => {
    values = arrKey._id;
    console.log(values);
    values === undefined
      ? message.warning(
          "Please choose list sales order  so that the website can perform delete all function!!!"
        )
      : onFinish_DeleteAll(values);
  };
  const onFinish_DeleteAll = (values) => {
    console.log(values);
    const fetchDeleteAll = async () => {
      try {
        console.log(values);
        const response = await salesApi.deleteMultiple(values);
        console.log("Delete multiple sales order successfully", response);
        fetchSalesList();
        notification.success({
          message: `Delete  multiple sales order successfully`,
          icon: <CheckOutlined style={{ color: "#108ee9" }} />,
          placement: "topRight",
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeleteAll();
  };
  const fetchSalesList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("jwt_Token"));
      console.log(">>",token);
      // console.log("<<<<", token);
      const response = await salesApi.getAll(token);
      // console.log("Fetch list sales order successfully: ", response);
      setListSales(response.data.data.salesOrder);
      const variable = localStorage.getItem("user");
      // console.log(variable);
      const result = response.data.data.salesOrder.filter(
        (contacts) => contacts.assignedTo === variable
      );
      // console.log(result);
      setStateUser(result);
      //   setIsloadingUpdate(false);
    } catch (error) {
      console.log("Failed to fetch contacts list: ", error);
    }
  };
  const fetchUserList = async () => {
    try {
      const response = await usersApi.getAll();
      // console.log("Fetch list users successfully: ", response);
      setListUser(response.data.data.users);

      //   setIsloadingUpdate(false);
    } catch (error) {
      console.log("Failed to fetch users list: ", error);
    }
  };
  const filterAssignedTo = async (values) => {
    // console.log(values);
    if (values) navigate("/sales-order");
    try {
      const token = JSON.parse(localStorage.getItem("jwt_Token"));
      const response = await salesApi.getAll(token);
      // console.log(
      //   "Fetch list sales order successfully: ",
      //   response.data.data.salesOrder
      // );
      const result = response.data.data.salesOrder.filter((sales) =>
        values === undefined && Object.keys(params).length === 0
          ? //  console.log("1")
            sales
          :  sales.status === params.statusValue ||
          sales.assignedTo === values || sales.status === values
      );
      // console.log(result);
      setListSales(result);
    } catch (error) {}
  };
  const handleChange_filterAssignedTo = (value) => {
    console.log(`selected ${value}`);
    value === undefined ? fetchSalesList() : filterAssignedTo(value);
  };
  const onConfirm = () => {
    let removeToken = authApi.doLogout();
    if (removeToken == null) {
      localStorage.clear();
      navigate("/login");
    }
  };
  const handleChange_filterStatus = (value) => {
    console.log(`selected ${value}`);
    value === undefined ? fetchSalesList() : filterAssignedTo(value);
  };
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("jwt_Token"));
    fetchUserList();
    // fetchSalesList();
    // console.log(params);
    filterAssignedTo();
    // setStateStatus(location.state.status)
    // console.log(location.state?.status)
    // Object.keys(params).length === 0 ? (
    //   salesApi.getAll(token).then((res) => {
    //     setListSales(res.data.data.salesOrder);
    //   })
    // ) : (
    //   <></>
    // );
  }, []);

  const openModal_Create = () => {
    setModalCreate(true);
    form.resetFields();
  };
  const cancelConfirm = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  const openModal_Edit = (values) => {
    setModalEdit(true);
    console.log(values);
    form_edit.setFieldsValue(values);
    setDataModal(values);
  };
  const handleCancel_createSalesOrder = () => {
    setModalCreate(false);
  };
  const handleCancel_editSalesOrder = () => {
    setModalEdit(false);
  };
  const onFinish_createSalesOrder = (values) => {
    console.log(values);
    const fetchCreateSalesOrder = async () => {
      try {
        const response = await salesApi.post(values);
        console.log("Fetch create sales order successfully: ", response);
        setListSales([...listSales, response]);
        fetchSalesList();
        notification.success({
          message: `Create sales order successfully`,
          icon: <CheckOutlined style={{ color: "#108ee9" }} />,
          placement: "topRight",
        });
        form.resetFields();
        setModalCreate(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCreateSalesOrder();
  };
  const fetchEditSales = async (id, data) => {
    try {
      setIsloadingUpdate(true);
      const response = await salesApi.edit(id, data);
      console.log("Fetch update sales order successfully:", response);
      setListSales([...listSales, response]);
      fetchSalesList();
      notification.success({
        message: `Edit sales order successfully`,
        icon: <CheckOutlined style={{ color: "#108ee9" }} />,
        placement: "topRight",
      });
      // form.resetFields();
      setModalEdit(false);
    } catch (error) {
      setIsloadingUpdate(false);
      console.log(error);
    }
  };
  const onFinish_editSales = (values) => {
    console.log(values);
    fetchEditSales(dataModal._id, values);
  };
  const fetchDeleteSalesOrder = async (record) => {
    try {
      console.log(record);
      const response = await salesApi.delete(record._id);
      console.log("Delete sales order successfully", response);
      notification.success({
        message: `Delete sales order successfully`,
        icon: <CheckOutlined style={{ color: "#108ee9" }} />,
        placement: "topRight",
      });
      fetchSalesList();
    } catch (error) {
      console.log("Failed to delete sales order list", error);
    }
  };

  const functionSearch = async (e) => {
    try {
      const response = await salesApi.search(e);
      console.log("Search successfully", response);
      setListSales(response.data.data.salesOrder);
    } catch (error) {}
  };
  const handleSearch = (e) => {
    // console.log(e.target.value)
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => {
      console.log(e);
      e === "" ? fetchSalesList() : functionSearch(e);
    }, 300);
  };
  const columns = [
    {
      title: "Assigned to",
      dataIndex: "assignedTo",
    },
    {
      title: "Contact Name",
      dataIndex: "contactName",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Creator",
      dataIndex: "creator",
    },

    {
      title: "Subject",
      dataIndex: "subject",
    },
    {
      title: "Total",
      dataIndex: "total",
    },

    {
      title: "Actions",
      key: "x",
      render: (text, record) => (
        <div style={{ display: "flex" }}>
          {/* <Popconfirm
            title="BẠN CÓ CHẮC MUỐN XÓA DỮ LIỆU KHÔNG?"
            onConfirm={() => fetchDeleteElectricityWater(record)}
            onCancel={cancel}
            okText="Có"
            cancelText="Không"
          > */}

          {/* </Popconfirm>  */}
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
              title="BẠN CÓ CHẮC MUỐN XÓA DỮ LIỆU KHÔNG?"
              onCancel={cancelConfirm}
              onConfirm={() => fetchDeleteSalesOrder(record)}
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
      {/* Modal Create Sales Order */}
      <Modal
        title="Modal Create User"
        visible={modalCreate}
        footer={null}
        // onOk={handleCancel_createUser}
      >
        <Form
          form={form}
          //   initialValues={dataToggleModal}
          onFinish={onFinish_createSalesOrder}
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
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please input status!" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="Created">Created</Radio>
                <Radio value="Approved">Approved</Radio>
                <Radio value="Delivered">Delivered</Radio>
                <Radio value="Cancelled">Cancelled</Radio>
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
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter your description!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please enter your subject!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Total"
            name="total"
            rules={[{ required: true, message: "Please enter your total!" }]}
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
                onClick={handleCancel_createSalesOrder}
                style={{ borderRadius: "8px" }}
              >
                HỦY BỎ
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
      {/* Modal Edit Sales Order */}
      <Modal
        title="Modal Create User"
        visible={modalEdit}
        footer={null}
        // onOk={handleCancel_createUser}
      >
        <Form
          form={form_edit}
          //   initialValues={dataToggleModal}
          onFinish={onFinish_editSales}
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
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please input status!" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="Created">Created</Radio>
                <Radio value="Approved">Approved</Radio>
                <Radio value="Delivered">Delivered</Radio>
                <Radio value="Cancelled">Cancelled</Radio>
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
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter your description!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please enter your subject!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Total"
            name="total"
            rules={[{ required: true, message: "Please enter your total!" }]}
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
          <div style={{ display: "flex" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: "8px" }}
            >
              CHỈNH SỬA{" "}
            </Button>
            <div style={{ paddingLeft: "10px" }}>
              <Button
                type="default"
                onClick={handleCancel_editSalesOrder}
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
          <p>SALES ORDER MANAGEMENT</p>
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
                onClick={() => onFinish_deleteAllSalesOrder()}
              >
                Delete
              </button>
              <Select
                allowClear
                size="medium"
                placeholder="Select Assigned To"
                className="selectAssignedTo"
                onChange={handleChange_filterAssignedTo}
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
                placeholder="Select Status"
                className="selectLeadSource"
                onChange={handleChange_filterStatus}
                defaultValue={params.statusValue}
              >
                <Select.Option value="Created">Created</Select.Option>
                <Select.Option value="Approved">Approved </Select.Option>
                <Select.Option value="Delivered">Delivered </Select.Option>
                <Select.Option value="Cancelled">Cancelled </Select.Option>
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
          <Table
            style={{ width: "100%" }}
            dataSource={listSales}
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
            dataSource={listSales}
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

export default SalesOrder;
