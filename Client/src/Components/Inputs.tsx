/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { StyleProp, TextInput, ViewStyle } from "react-native";

function MyInputText(
  // color: string | typeof OpaqueColorValue | undefined,
  style: StyleProp<ViewStyle>,
  placeholder: string | undefined,
  keyboardType:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad"
    | "decimal-pad"
    | "visible-password"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "url"
    | "name-phone-pad"
    | "twitter"
    | "web-search"
    | undefined,
  onChangeText: ((text: string) => void) | undefined,
  secureTextEntry: boolean | undefined
): JSX.Element {
  return (
    <TextInput
      style={style}
      placeholder={placeholder}
      keyboardType={keyboardType}
      underlineColorAndroid="transparent"
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
}

export default MyInputText;
