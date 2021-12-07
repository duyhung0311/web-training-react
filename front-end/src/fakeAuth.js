import React from "react";
import { Routes,Navigate } from "react-router-dom";

export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100); // fake async
  },
};

// export const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Routes
//     {...rest}
//     render={(props) =>
//       fakeAuth.isAuthenticated === true ? (
//         <Component {...props} />
//       ) : (
//         <Navigate to="/contact" />
//       )
//     }
//   />
// );
// export const PrivateRoute=({ children }) => {
//   const auth = useAuth();
//   return auth ? children : <Navigate to="/login" />;
// }