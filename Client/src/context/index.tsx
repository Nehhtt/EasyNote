import { signUpUser, loginUser, logout } from "./action";
import { AuthProvider, useAuthDispatch, useAuthState } from "./context";

export {
  AuthProvider,
  useAuthState,
  useAuthDispatch,
  signUpUser,
  loginUser,
  logout,
};
