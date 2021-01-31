/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import React from "react";
import { StyleSheet, View } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import Spinner from "react-native-loading-spinner-overlay";
import MyInputText from "./Inputs";
import { dimensions, colors, font } from "../styles/base";
import { MySimpleButton } from "./MyButtons";
import { loginUser, useAuthDispatch } from "../context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    alignItems: "center",
    width: dimensions.fullWidth,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: colors.whiteBlue,
    width: dimensions.fullWidth / 1.5,
    height: 45,
    borderRadius: 15,
    shadowColor: "black",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  input: {
    marginLeft: 16,
    flex: 1,
    fontFamily: font.primary,
    color: colors.darkGrey,
  },
  buttonMdp: {
    backgroundColor: colors.backGroundColor,
    marginTop: 15,
  },
  titleStyleMdp: {
    fontFamily: font.primary,
    fontSize: font.xs,
    color: colors.mediumGrey,
  },
  buttonLogin: {
    backgroundColor: colors.darkGrey,
    borderRadius: 10,
    width: dimensions.fullWidth / 1.5,
    marginTop: 35,
  },
  titleStyleLogin: {
    fontFamily: font.primary,
    fontSize: font.sm,
    color: "white",
  },
});

const LoginView = (props): JSX.Element => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const dispatch = useAuthDispatch();

  const onClickListener = (viewId: string): void => {
    setLoading(true);
    if (viewId === "login") {
      loginUser(dispatch, {
        email,
        password,
      }).then((response) => {
        if (response.status === "success") {
          setLoading(false);
          props.history.push("/main");
        } else {
          console.log(response);
        }
      });
    }
  };

  return (
    <>
      <Spinner
        visible={loading}
        textContent="Chargement..."
        overlayColor="rgba(255, 255, 255, 1)"
      />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={error}
        closeOnTouchOutside
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton
        confirmText="OK"
        confirmButtonColor={colors.mediumGrey}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <MyInputText
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            onChangeText={(value: string) => setEmail(value)}
            secureTextEntry={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <MyInputText
            style={styles.input}
            placeholder="Mot de passe"
            keyboardType="default"
            secureTextEntry
            onChangeText={(value: string) => setPassword(value)}
          />
        </View>
        <MySimpleButton
          title="CONTINUER"
          onPress={() => onClickListener("login")}
          style={styles.buttonLogin}
          titleStyle={styles.titleStyleLogin}
        />
      </View>
    </>
  );
};

export default LoginView;
