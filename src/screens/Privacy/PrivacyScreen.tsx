import React from "react";

import WebView from "react-native-webview";

type TProps = {};

export const PrivacyScreen: React.FC<TProps> = (props) => {
  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri: "https://www.care-steps.com/privacy" }}
    />
  );
};
