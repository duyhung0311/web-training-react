import { Navigate } from "react-router-dom";
import Contact from './feature/contact'
import Login from "./feature/login";
import SalesOrder from "./feature/sales-order";
import User from "./feature/user";
import Dashboard from "./feature/dashboard"
import Profile from "./feature/profile";
import Password from "./feature/password";
const routes = (isLoggedIn) => [
  {
    path: "/user",
    element: isLoggedIn ? <User /> : <Navigate to="/" />,
  },
  {
    path: "/contact",
    element: isLoggedIn ? <Contact /> : <Navigate to="/" />,
  },
  {
    path: "/sales-order",
    element: isLoggedIn ? <SalesOrder /> : <Navigate to="/" />,
  },
  {
    path: "/dashboard",
    element: isLoggedIn ? <Dashboard /> : <Navigate to="/" />,
  },
  {
    path: "/profile",
    element: isLoggedIn ? <Profile /> : <Navigate to="/" />,
  },
  {
    path: "/password",
    element: isLoggedIn ? <Password /> : <Navigate to="/" />,
  },
  {
    path: "/",
    element: <Login />,
  },
];

export default routes;
