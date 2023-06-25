import { Route, Routes } from "react-router-dom";
import { RouterType } from "../types/router.types";
import pagesData from "./pagesData";

const Router = () => {
  return <Routes>
    {pagesData.map( ( { path, title, element }: RouterType ) =>
      <Route key={title} path={`/${ path }`} element={element} />
    )}
  </Routes>;
};

export default Router;