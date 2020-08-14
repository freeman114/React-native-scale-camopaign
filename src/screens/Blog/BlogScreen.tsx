import React from "react";
import WebView from "react-native-webview";

type TProps = {};

export const BlogScreen: React.FC<TProps> = (props) => {
  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri: "https://www.care-steps.com/blog" }}
    />
  );
};

