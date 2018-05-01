import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

type PropsType = {
  onFirstColorChange: () => void,
  onSecondColorChange: () => void,
  firstColor: string,
  secondColor: string,
  firstLabel: string,
  secondLabel: string,
  style?: any
};

class TwoColorPicker extends Component<PropsType> {
  render() {
    const {
      firstColor,
      secondColor,
      firstLabel,
      secondLabel,
      onFirstColorChange,
      onSecondColorChange
    } = this.props;

    return (
      <View style={this.props.style}>
        <View style={styles.colorPicker}>
          <label htmlFor="firstColor">{firstLabel}</label>
          <input
            id="firstColor"
            type="color"
            value={firstColor}
            onChange={onFirstColorChange}
          />
        </View>
        <View style={styles.colorPicker}>
          <label htmlFor="secondColor">{secondLabel}</label>
          <input
            id="secondColor"
            type="color"
            value={secondColor}
            onChange={onSecondColorChange}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  }
});

export default TwoColorPicker;
