import React from "react";

import WebView from "react-native-webview";

type TProps = {};

export const AboutScreen: React.FC<TProps> = (props) => {
  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri: "https://scalecampaign.com" }}
    />
  );
};
