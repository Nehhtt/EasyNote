import AsyncStorage from "@react-native-async-storage/async-storage";
import JsonSettings from "../JsonSettings/settings.json";

const ROOT_URL = JsonSettings.appSettings;

export async function loginUser(dispatch, loginPayload) {
  console.log(loginPayload);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginPayload),
  };

  try {
    dispatch({ type: "REQUEST_LOGIN" });
    const response = await fetch(`${ROOT_URL}/auth/login`, requestOptions);
    const data = await response.json();
    if (data.data) {
      dispatch({ type: "LOGIN_SUCCESS", payload: data.data });
      await AsyncStorage.setItem("currentUser", JSON.stringify(data));
      return data;
    }

    dispatch({ type: "LOGIN_ERROR", error: data.error.message });
    return "error";
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error });
  }
  return "success";
}

export async function signUpUser(dispatch, signUpPayload) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signUpPayload),
  };
  try {
    dispatch({ type: "REQUEST_SIGNUP" });
    const response = await fetch(`${ROOT_URL}/auth/signup`, requestOptions);
    const data = await response.json();

    if (data.data) {
      dispatch({ type: "SIGNUP_SUCCESS", payload: data });
      await AsyncStorage.setItem("currentUser", JSON.stringify(data));
      return data;
    }
    dispatch({ type: "SIGNUP_ERROR", error: data.error.message });
    return "error";
  } catch (error) {
    dispatch({ type: "SIGNUP_ERROR", error });
  }
  return "success";
}

export async function logout(dispatch) {
  dispatch({ type: "LOGOUT" });
  await AsyncStorage.removeItem("currentUser");
  await AsyncStorage.removeItem("token");
  return "success";
}
