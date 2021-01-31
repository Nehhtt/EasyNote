import LoginPage from "../containers/LoginOrRegister/index";
import MainPage from "../containers/MainPage/index";

const routes = [
  {
    path: "/login",
    component: LoginPage,
    isPrivate: false,
  },
  {
    path: "/main",
    component: MainPage,
    isPrivate: true,
  },
];

export default routes;
