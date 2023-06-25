import { RouterType } from "../types/router.types";
import Home from "./Home";

const pagesData: RouterType[] = [
  {
    path: "",
    element: <Home />,
    title: "home"
  }
]

export default pagesData