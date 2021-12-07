import React, { useState, useEffect } from "react";
import "./style.css";
import Menu from "../../components/menu";
import contactApi from "../../api/contactApi";
import { Table, Tabs, Tag, Popconfirm } from "antd";
import Chart from "react-google-charts";
import { useNavigate } from "react-router-dom";
import salesApi from "../../api/salesApi";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import authApi from "../../api/authApi";
import jwt_decode from "jwt-decode";
import userApi from "../../api/userApi";
function Dashboard() {
  const [tableContact, setTableContact] = useState([]);
  const [tableStatus, setTableStatus] = useState([]);
  const [chartLabelContact, setChartLabelContact] = useState([]);
  const [chartStatusContact, setChartStatusContact] = useState([]);
  const [tableTimeContact, setTableTimeContact] = useState([]);
  const [tableTimeSalesOrder, setTableTimeSalesOrder] = useState([]);
  const [stateObjectRow, setStateObjectRow] = useState({});
  const [stateTable, setStateTable] = useState(false);
  const [stateProfile, setstateProfile] = useState({});
  let arrLabel = [];
  let arrValue = [];
  let arrLabel_Status = [];
  let arrValue_Status = [];
  const navigate = useNavigate();
  const { TabPane } = Tabs;
  let obj = {};
  const onConfirm = () => {
    let removeToken = authApi.doLogout()
    if (removeToken == null) {
      localStorage.clear();
      navigate("/");
    }
  };
  const fetchGetAllContact = async () => {
    try {
      const response = await contactApi.getAll();
      console.log("Get all", response.data.data.contacts);
      const rx = response.data.data.contacts;
      //   console.log(rx);
      obj = rx.reduce(function (r, a) {
        r[a.leadSrc] = r[a.leadSrc] || [];
        r[a.leadSrc].push(a);
        return r;
      }, Object.create(null));
      const newArr = [];
      const newArrAfter = [];
      for (let x in obj) {
        newArr.push({ key: [x], value: obj[x].length });
      }
      for (let x in obj) {
        newArrAfter.push({ [x]: obj[x].length });
      }
      for (var i = 0, l = newArrAfter.length; i < l; i++) {
        var items = newArrAfter[i];
        var keys = Object.keys(items);

        for (var j = 0, k = keys.length; j < k; j++) {
          //   console.log(keys[j], items[keys[j]]);
          arrLabel.push(keys[j]);
          arrValue.push(items[keys[j]]);
          //   setChartLabelContact(...keys[j], keys[j]);
          //   setChartValueContact(...items[keys[j]], items[keys[j]]);
        }
      }
      //   console.log(arrLabel, arrValue);
      const chartData = [["Key", "Value"]];
      for (let i = 0; i < arrLabel.length; i += 1) {
        chartData.push([arrLabel[i], arrValue[i]]);
      }
      //   console.log(chartData);
      setChartLabelContact(chartData);
      //   setChartValueContact(arrValue)
      setTableContact(newArr);
      const dateDemo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const date = moment(dateDemo).toISOString();
      const result = response.data.data.contacts.filter(
        (contacts) => contacts.createdTime < date
      );
      setTableTimeContact(result);
    } catch (error) {
      console.log("Failed to fetch contacts list: ", error);
    }
  };
  const fetchGetAllSalesOrder = async () => {
    try {
      const response = await salesApi.getAll();
      console.log("Get all sales order successfully", response);
      const rx = response.data.data.salesOrder;
      //   console.log(rx);
      obj = rx.reduce(function (r, a) {
        r[a.status] = r[a.status] || [];
        r[a.status].push(a);
        return r;
      }, Object.create(null));
      //   console.log(obj);
      const newArr = [];
      const newArrAfter = [];
      for (let x in obj) {
        newArr.push({ status: [x], total: obj[x].length });
      }
      setTableStatus(newArr);
      for (let x in obj) {
        newArrAfter.push({ [x]: obj[x].length });
      }
      //   console.log(newArrAfter)
      for (var i = 0, l = newArrAfter.length; i < l; i++) {
        var items = newArrAfter[i];
        var keys = Object.keys(items);
        for (var j = 0, k = keys.length; j < k; j++) {
          //   console.log(keys[j], items[keys[j]]);
          arrLabel_Status.push(keys[j]);
          arrValue_Status.push(items[keys[j]]);
        }
      }
      //   console.log(arrLabel_Status, arrValue_Status);
      const chartData = [["Status", "Total"]];
      for (let i = 0; i < arrLabel_Status.length; i += 1) {
        chartData.push([arrLabel_Status[i], arrValue_Status[i]]);
      }
      //   console.log(chartData)
      setChartStatusContact(chartData);
      const dateDemo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const date = moment(dateDemo).toISOString();
      const result = response.data.data.salesOrder.filter(
        (contacts) => contacts.createdTime < date
      );
      console.log(result);
      setTableTimeSalesOrder(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGetAllContact();
    fetchGetAllSalesOrder();
  }, []);
  const clickKey = (values) => {
    console.log(values.key[0]);
    const result = values.key[0];
    console.log(result)
    navigate(`/contact`, { state: { name: result } });
  };
  const clickSales = (values)=>{
    console.log(values.status[0]);
     const result = values.status[0];
     navigate(`/sales-order`, { state: { status: result } });
  }
  const clickLastTable = (values) => {
    console.log(values.contactName);
    setStateTable(true);
    setStateObjectRow(values);
  };
  const clickUser =(values)=>{
    console.log(values.assignedTo);
    const result = values.assignedTo;
    navigate(`/contact`, { state: { value: result } });
  }
  const backIcon = () => {
    setStateTable(false);
  };
  const columns = [
    {
      title: "Key",
      dataIndex: "key",
    },
    {
      title: "Value",
      dataIndex: "value",
    },
  ];
  const columns_second = [
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Total",
      dataIndex: "total",
    },
  ];
  const columns_third = [
    {
      title: "Name",
      dataIndex: "contactName",
    },
    {
      title: "Assigned to",
      dataIndex: "assignedTo",
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      render: (createdTime) => <Tag color="#2db7f5">{createdTime}</Tag>,
    },
  ];
  const columns_fourth = [
    {
      title: "Name",
      dataIndex: "contactName",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      render: (createdTime) => <Tag color="#f50">{createdTime}</Tag>,
    },
  ];

  function callback(key) {
    console.log(key);
  }
  return (
    <div>
      <div className="container">
        <div className="left-side">
          <Menu />
        </div>
        <div className="right-side">
          <div className="inner-topic">
            <div className="flex-center-right-side">
              <p>DASHBOARD MANAGEMENT</p>
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
            <div>{stateProfile.isAdmin}</div>
          </div>
          <div className="container-btn ">
            <div style={{ display: "block" }}></div>
          </div>
          <div className="container-btn border-container">
            <Tabs
              style={{ width: "100%", marginLeft: "20px", marginRight: "20px" }}
              onChange={callback}
            >
              <TabPane key="1" tab="Filtered lead source of contact">
                <Table
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        clickKey(record);
                      }, // click row
                    };
                  }}
                  columns={columns}
                  className="table"
                  dataSource={tableContact}
                  bordered
                />
              </TabPane>
              <TabPane tab="Chart filtered lead source of contact" key="2">
                <Chart
                  width={"1500px"}
                  height={"700px"}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={chartLabelContact}
                  options={{
                    title: "Chart filtered lead source of contact",
                  }}
                  rootProps={{ "data-testid": "1" }}
                />
                ;
              </TabPane>
            </Tabs>
          </div>
          <div className="container-btn border-container">
            <Tabs
              style={{ width: "100%", marginLeft: "20px", marginRight: "20px" }}
              onChange={callback}
            >
              <TabPane key="3" tab="Filtered status of sales order">
                <Table
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        clickSales(record);
                      }, // click row
                    };
                  }}
                  columns={columns_second}
                  className="table"
                  dataSource={tableStatus}
                  bordered
                />
              </TabPane>
              <TabPane tab="Chart filtered status of sales order" key="4">
                <Chart
                  width={"1500px"}
                  height={"700px"}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={chartStatusContact}
                  options={{
                    title: "Chart filtered status of sales order",
                  }}
                  rootProps={{ "data-testid": "2" }}
                />
                ;
              </TabPane>
            </Tabs>
          </div>
          {localStorage.getItem("admin") === "false" ? (
            <></>
          ) : (
            <>
              <div className="container-btn border-container">
                <Table
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        clickUser(record);
                      }, // click row
                    };
                  }}
                  style={{ marginLeft: "20px", marginRight: "20px" }}
                  columns={columns_third}
                  className="table"
                  dataSource={tableTimeContact}
                  bordered
                />
              </div>
              <div className="container-btn border-container">
                {stateTable === false ? (
                  <Table
                    style={{ marginLeft: "20px", marginRight: "20px" }}
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          clickLastTable(record);
                        }, // click row
                      };
                    }}
                    columns={columns_fourth}
                    className="table"
                    dataSource={tableTimeSalesOrder}
                    bordered
                  />
                ) : (
                  <div style={{ paddingLeft: "10px", width: "100%" }}>
                    <FontAwesomeIcon
                      onClick={backIcon}
                      icon={faArrowRight}
                      size="2x"
                    />
                    <div style={{ width: "100%", display: "flex" }}>
                      <div className="contentLeft">Assigned To:</div>
                      <div className="contentRight">
                        {stateObjectRow.assignedTo}
                      </div>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <div className="contentLeft">Contact Name:</div>
                      <div className="contentRight">
                        {stateObjectRow.contactName}
                      </div>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <div className="contentLeft">Creator:</div>
                      <div className="contentRight">
                        {stateObjectRow.creator}
                      </div>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <div className="contentLeft">Description:</div>
                      <div className="contentRight">
                        {stateObjectRow.description}
                      </div>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <div className="contentLeft">Status:</div>
                      <div className="contentRight">
                        {stateObjectRow.status}
                      </div>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <div className="contentLeft">Subject:</div>
                      <div className="contentRight">
                        {stateObjectRow.subject}
                      </div>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <div className="contentLeft">Total:</div>
                      <div className="contentRight">{stateObjectRow.total}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
