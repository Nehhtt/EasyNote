import { lazy } from "react";

const LoginPage = lazy(() => import("../containers/LoginOrRegister/index"));

const routes = [
  {
    path: "/login",
    component: LoginPage,
    isPrivate: false,
  },
];

export default routes;
