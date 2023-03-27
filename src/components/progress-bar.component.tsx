import {Animated, Dimensions} from "react-native";
import React from "react";
import Value = Animated.Value;

const ProgressBarComponent = ({
                                progressBarOpacity,
                                progress,
                              }: {
  progressBarOpacity: Value;
  progress: number;
}) => {
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 2,
        opacity: progressBarOpacity,
        width: Dimensions.get("window").width * progress,
        backgroundColor: "#ea9528",
        height: 2,
      }}
    />
  );
};

export default ProgressBarComponent;
