import { RouterType } from "../types/router.types";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./Home";

const pagesData: RouterType[] = [
  {
    path: "",
    element: <Home />,
    title: "home"
  },
  {
    path: "/signup",
    element: <Register />,
    title: "signup"
  },
  {
    path: "/signin",
    element: <Login />,
    title: "signin"
  },
]

export default pagesData