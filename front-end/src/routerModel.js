import Contact from "./feature/contact";
import Login from "./feature/login";
import SalesOrder from "./feature/sales-order";
import User from "./feature/user";
import Dashboard from "./feature/dashboard";
import Profile from "./feature/profile";
import Password from "./feature/password";
import PrivateRoute from "./privateRoute";
const routes = [
  {
    path: "/login",
    component: <Login />,
  },
  {
    path: "/dashboard",
    component: <Dashboard />,
  },
  {
    path: "/contact",
    component: <Contact />,
  },
  {
    path: "/contact/:leadSourceValue/:assignedValue",
    component: <Contact />,
  },
  {
    path: "/sales-order",
    component: <SalesOrder />,
  },
  {
    path:"/sales-order/:statusValue",
    component: <SalesOrder />,
  },
  {
    path: "/profile",
    component: <Profile />,
  },
  {
    path: "/password",
    component: <Password />,
  },
  {
    path: "/user",
    component:
      localStorage.getItem("admin") === "false" ? (
        <PrivateRoute>
          <User />
        </PrivateRoute>
      ) : (
        <User />
      ),
  },
];

export default routes;
