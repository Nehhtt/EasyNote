import AsyncStorage from "@react-native-async-storage/async-storage";

const getUser = async () => {
  const user = (await AsyncStorage.getItem("currentUser"))
    ? JSON.parse(AsyncStorage.getItem("currentUser")).data.user
    : "";
  return user;
};

const getToken = async () => {
  const token = (await AsyncStorage.getItem("currentUser"))
    ? JSON.parse(AsyncStorage.getItem("currentUser")).token
    : "";
  return token;
};

export const initialState = {
  userDetails: "" || getUser(),
  token: "" || getToken(),
  loading: false,
  errorMessage: null,
};

export const AuthReducer = (action) => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...initialState,
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...initialState,
        user: action.payload.data.user,
        token: action.payload.token,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
        user: "",
        token: "",
      };
    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };
    case "REQUEST_SIGNUP":
      return {
        ...initialState,
        loading: true,
      };
    case "SIGNUP_SUCCESS":
      return {
        ...initialState,
        user: action.payload.data.user,
        loading: false,
      };
    case "SIGNUP_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };
    case "SET_CURRENT_ROOM":
      return {
        ...initialState,
        loading: false,
      };

    default:
      return action;
  }
};
