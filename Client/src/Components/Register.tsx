/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Actions } from 'react-native-router-flux';

import AwesomeAlert from "react-native-awesome-alerts";
import Spinner from "react-native-loading-spinner-overlay";
import JsonSettings from "../JsonSettings/settings.json";
import MyInputText from "./Inputs";
import { dimensions, colors, font } from "../styles/base";
import { MySimpleButton } from "./MyButtons";
import { signUpUser, useAuthDispatch } from "../context";

const RegisterView = (props): JSX.Element => {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>("");
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const dispatch = useAuthDispatch();

  const onClickListener = (viewId: string): void => {
    setLoading(true);
    if (viewId === "register") {
      const response = signUpUser(dispatch, {
        email,
        password,
        userName: email,
      });
      if (response.status === "success") {
        setLoading(false);
        props.history.push("/login");
      } else {
        console.log(response);
      }
    }
  };

  return (
    <View style={styles.container}>
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
      <View style={styles.inputContainer}>
        <MyInputText
          style={styles.input}
          placeholder="Nom"
          underlineColorAndroid="transparent"
          onChangeText={(value: string) => setName(value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <MyInputText
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onChangeText={(value: string) => setEmail(value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <MyInputText
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          underlineColorAndroid="transparent"
          onChangeText={(value: string) => setPassword(value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <MyInputText
          style={styles.input}
          placeholder="Vérifier le mot de passe"
          secureTextEntry
          underlineColorAndroid="transparent"
          onChangeText={(value: string) => setPasswordConfirm(value)}
        />
      </View>
      <MySimpleButton
        title="CONTINUER"
        onPress={() => onClickListener("register")}
        style={styles.buttonLogin}
        titleStyle={styles.titleStyleRegister}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.backGroundColor,
    width: dimensions.fullWidth,
    paddingTop: 70,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: colors.whiteBlue,
    width: dimensions.fullWidth / 1.5,
    height: 45,
    borderRadius: 15,
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 4,
  },
  input: {
    marginLeft: 16,
    flex: 1,
    fontFamily: font.primary,
    color: colors.darkGrey,
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  RegisterButton: {
    backgroundColor: "#00b5ec",
  },
  RegisterText: {
    color: "white",
  },
  buttonLogin: {
    backgroundColor: colors.darkGrey,
    borderRadius: 10,
    width: dimensions.fullWidth / 1.5,
    marginTop: 30,
  },
  titleStyleRegister: {
    fontFamily: font.primary,
    fontSize: font.sm,
    color: "white",
  },
});

export default RegisterView;
