import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

type Props = {
  message: string;
  visible: boolean;
  onHide: () => void;
};

export default function InAppBanner({ message, visible, onHide }: Props) {
  const translateY = useRef(new Animated.Value(-200)).current;
  const onHideRef = useRef(onHide);

  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -200,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHideRef.current());
      }, 6000);

      return () => clearTimeout(timeout);
    }

    Animated.timing(translateY, {
      toValue: -200,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [message, translateY, visible]);

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#173530",
    padding: 16,
    zIndex: 999,
  },
  text: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
