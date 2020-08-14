import React from "react";
import {
  StyleSheet,
  Image,
  ImageSourcePropType,
  ViewStyle,
  ImageStyle,
  View,
  Text
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../theme";

type TProps = {
  source?: ImageSourcePropType;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  firstName: string;
  lastName: string;
  status?: "online" | "bussy";
};

export const Avatar: React.FC<TProps> = props => {
  return (
    <View style={[styles.container, props.style]}>
      {props.source
        ? <Image source={props.source} style={[props.imageStyle, styles.image]} />
        : (
          <View style={[styles.avatarRounded]}>
            <Text style={styles.avatarText}>{props.firstName[0]}{props.lastName[0]}</Text>
          </View>
        )
      }
      {props.status && (
        <View
          style={[
            styles.status,
            {
              backgroundColor:
                props.status === "online"
                  ? Theme.colors.status.online
                  : Theme.colors.status.bussy
            }
          ]}
        >
          <Ionicons
            name={props.status === "online" ? "ios-checkmark" : "ios-close"}
            color="white"
            size={15}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 64,
    height: 64,
    borderRadius: 12
  },
  avatarRounded: {
    backgroundColor: '#FD612B',
    width: 130,
    height: 130,
    borderRadius: 70,
    borderWidth: 0.5,
    alignSelf: "center",
    marginTop: 36,
    borderColor: '#FD612B',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  avatarText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold'
  },
  status: {
    position: "absolute",
    width: 16,
    height: 16,
    bottom: -2,
    end: -4,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Theme.colors.grayForBoxBackground,
    borderWidth: 1
  }
});
