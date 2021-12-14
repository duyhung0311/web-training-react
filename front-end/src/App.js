import "./App.css";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Menu from "./components/menu";
import {  map } from "lodash";
import RouterModel from "./routerModel";
function App() {
  const location = useLocation();
  return (
    // <Routes>
    //   <Route path="/dashboard" element={<Dashboard />} />
    //   <Route path="/contact" element={<Contact />} />
    //   <Route
    //     path="/contact/:leadSourceValue/:assignedValue"
    //     element={<Contact />}
    //   />
    //   <Route path="/sales-order" element={<SalesOrder />} />
    //   <Route path="/sales-order/:statusValue" element={<SalesOrder />} />
    //   <Route path="/profile" element={<Profile />} />
    //   <Route path="/password" element={<Password />} />
    //   <Route
    //     path="/user"
    //     element={
    //       localStorage.getItem("admin") === "false" ? (
    //         <PrivateRoute>
    //           <User />
    //         </PrivateRoute>
    //       ) : (
    //         <User />
    //       )
    //     }
    //   />
    //   <Route path="/login" element={<Login />} />
    // </Routes>
    <>
      <div className="container">
        {!["/login"].includes(location.pathname) && (
          <div className="left-side">
            <Menu />
          </div>
        )}
        {localStorage.getItem("jwt_Token") ? (
          <>
            {/* {console.log("ba")} */}
            <div className="right-side">
              <Routes>
                {map(RouterModel, (item, key) => {
                  return (
                    <Route
                      path={item.path}
                      element={item.component}
                      key={item.path}
                    />
                  );
                })}
              </Routes>
            </div>
          </>
        ) : (
          <>
            {/* {console.log("a")} */}
            <div className="right-side" style={{ width: "100%" }}>
              <Routes>
                {map(RouterModel, (item, key) => {
                  return (
                    <Route
                      path={item.path}
                      element={item.component}
                      key={item.path}
                    />
                  );
                })}
              </Routes>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
