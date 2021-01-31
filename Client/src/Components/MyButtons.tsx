/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { ViewStyle, StyleProp, GestureResponderEvent } from "react-native";
import { Button } from "react-native-elements";

function MySimpleButton(
  title: string,
  onPress: ((event: GestureResponderEvent) => void) | undefined,
  style: StyleProp<ViewStyle>,
  titleStyle: StyleProp<ViewStyle>
): JSX.Element {
  return (
    <Button
      title={title}
      onPress={onPress}
      buttonStyle={style}
      titleStyle={titleStyle}
    />
  );
}

function MyIconButton(
  title: string,
  onPress: ((event: GestureResponderEvent) => void) | undefined,
  style: StyleProp<ViewStyle>,
  titleStyle: StyleProp<ViewStyle>,
  icon: boolean
): JSX.Element {
  return (
    <Button
      title={title}
      onPress={onPress}
      buttonStyle={style}
      titleStyle={titleStyle}
      icon={icon}
    />
  );
}

export { MySimpleButton, MyIconButton };
