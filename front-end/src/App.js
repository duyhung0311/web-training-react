import "./App.css";
import Contact from "./feature/contact";
import Login from "./feature/login";
import Profile from "./feature/profile";
import { Route, Routes, Switch, useRoutes } from "react-router-dom";
import routes from "./routerModel";
import authApi from './api/authApi'
import {useEffect} from 'react'
function App() {
  const variable = localStorage.getItem("Token");
  console.log(variable);
  const routing = useRoutes(routes(variable));
  return <div>{routing}</div>;
}

export default App;
