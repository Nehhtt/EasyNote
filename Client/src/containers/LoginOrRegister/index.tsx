/* eslint-disable import/extensions */
import * as React from "react";
import { StyleSheet, View } from "react-native";

import { MySimpleButton } from "../../Components/MyButtons";
import { dimensions, colors, font } from "../../styles/base";
import LoginView from "../../Components/Login";
import RegisterView from "../../Components/Register";

const styles = StyleSheet.create({
  groupButton: {
    flexDirection: "row",
    justifyContent: "center",
    width: dimensions.fullWidth,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backGroundColor,
  },
  titleStyle: {
    color: colors.darkGrey,
    fontFamily: font.primary,
    fontSize: font.md,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderBottomColor: colors.whiteBlue,
    borderBottomWidth: 1,
    backgroundColor: colors.whiteBlue,
    borderRadius: 1,
    width: dimensions.fullWidth / 2,
  },
});

const LoginOrRegister = (): JSX.Element => {
  const [index, setIndex] = React.useState<number>(0);

  const displayView = (): JSX.Element => {
    if (index === 0) {
      return <LoginView />;
    }
    return <RegisterView />;
  };

  return (
    <>
      <View style={styles.groupButton}>
        <MySimpleButton
          title="Connexion"
          onPress={() => setIndex(0)}
          style={styles.button}
          titleStyle={styles.titleStyle}
        />
        <MySimpleButton
          title="Enregistrement"
          onPress={() => setIndex(1)}
          style={styles.button}
          titleStyle={styles.titleStyle}
        />
      </View>
      <View style={styles.container}>
        <View>{displayView()}</View>
      </View>
    </>
  );
};

export default LoginOrRegister;
