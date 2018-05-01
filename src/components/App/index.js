import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import Dropzone from "react-dropzone";
import ToggleButton from "react-toggle-button";
import TwoColorPicker from "./TwoColorPicker";

const JSZip = require("jszip");
const style = document.createElement("style");
style.type = "text/css";
document.head.appendChild(style);

let Icon;

const jsZip = new JSZip();
const reader = new FileReader();
reader.onloadend = () => {
  const iconFontStyles = `@font-face {
        font-family: icomoon;
        src: url(${reader.result});
      }`;
  if (style.styleSheet) {
    style.styleSheet.cssText = iconFontStyles;
  } else {
    style.appendChild(document.createTextNode(iconFontStyles));
  }
};
class App extends Component<void, StateType> {
  state = {
    iconSize: 50,
    iconNames: [],
    backgroundColor: "#FFFFFF",
    iconsColor: "#000000",
    showBorder: true,
    crop: true
  };

  _handleZipFileChange = zipFile => {
    jsZip
      .loadAsync(zipFile[0])
      .then(zipFile => ({
        selection: zipFile.file("selection.json").async("string"),
        ttfFile: zipFile.file("fonts/icomoon.ttf").async("blob")
      }))
      .then(filePromises => {
        filePromises.ttfFile.then(ttfFile => reader.readAsDataURL(ttfFile));
        filePromises.selection.then(this._parseSelectionFile);
      })
      .catch(() => alert("Not a valid zip file"));
  };

  _parseSelectionFile = selectionFile => {
    const icons = JSON.parse(selectionFile).icons;
    Icon = createIconSetFromIcoMoon(JSON.parse(selectionFile));
    this.setState({ iconNames: icons.map(icon => icon.properties.name) });
    this.forceUpdate();
  };

  _handleIconSizeChange = value => {
    this.setState({
      iconSize: value
    });
  };

  _onBackgroundColorChange = event => {
    this.setState({
      backgroundColor: event.target.value
    });
  };

  _onIconsColorChange = event => {
    this.setState({
      iconsColor: event.target.value
    });
  };

  _onFileDrop = file => {
    this._handleZipFileChange(file);
  };

  _withBorderIcon = () => ({
    margin: this.state.iconSize / 10,
    borderWidth: 1,
    borderColor: "#000000"
  });

  _withoutBorderIcon = () => ({ margin: this.state.iconSize / 10 + 1 });

  _renderIcons = () =>
    this.state.iconNames.map((iconName, index) => (
      <View
        key={index}
        style={[
          this.state.showBorder
            ? this._withBorderIcon()
            : this._withoutBorderIcon()
        ]}
      >
        <Icon
          style={
            this.state.crop && {
              overflow: "hidden"
            }
          }
          color={this.state.iconsColor}
          name={iconName}
          size={Number(this.state.iconSize)}
        />
      </View>
    ));

  _renderParametersBoard = () => (
    <View style={styles.parameters}>
      <View style={styles.parameter}>
        <Text>Montrer les icones originales</Text>
        <ToggleButton value={!this.state.crop} onToggle={this._onCropToggle} />
      </View>
      <View style={styles.parameter}>
        <Text>Montrer les bords des icônes</Text>
        <ToggleButton
          value={this.state.showBorder}
          onToggle={this._onShowBorderToggle}
        />
      </View>
      <View style={styles.parameter}>
        <Text>Size : {this.state.iconSize}</Text>
        <input
          type="range"
          min="1"
          max="100"
          value={this.state.iconSize}
          onChange={e => this._handleIconSizeChange(e.target.value)}
        />
      </View>
      <TwoColorPicker
        style={styles.parameter}
        onFirstColorChange={this._onBackgroundColorChange}
        onSecondColorChange={this._onIconsColorChange}
        firstColor={this.state.backgroundColor}
        secondColor={this.state.iconsColor}
        firstLabel="Couleur d'arrière plan"
        secondLabel="Couleur des icônes"
      />
    </View>
  );

  _onCropToggle = value => this.setState({ crop: value });

  _onShowBorderToggle = value => this.setState({ showBorder: !value });

  render() {
    return (
      <View
        style={[styles.app, { backgroundColor: this.state.backgroundColor }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Icomoon font previsualizer</Text>
        </View>
        <Dropzone
          onDrop={this._onFileDrop}
          style={StyleSheet.flatten(styles.dropZone)}
        >
          <p style={{ textAlign: "center" }}>Drop Icomoon ZIP here</p>
        </Dropzone>
        {this._renderParametersBoard()}
        <View style={styles.iconsWrapper}>{this._renderIcons()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  parameters: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-around",
    width: "80%"
  },
  parameter: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1
  },
  iconsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%"
  },
  header: {
    padding: 20
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginVertical: "1em",
    textAlign: "center"
  },
  dropZone: {
    width: "90%",
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default App;
