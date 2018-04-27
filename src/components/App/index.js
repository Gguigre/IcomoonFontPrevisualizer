import React, { Component } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import Dropzone from "react-dropzone";
import ToggleButton from "react-toggle-button";

var JSZip = require("jszip");

const Link = props => (
  <Text
    {...props}
    accessibilityRole="link"
    style={StyleSheet.compose(styles.link, props.style)}
  />
);

const style = document.createElement("style");
style.type = "text/css";
document.head.appendChild(style);

let Icon;

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
    var zip = new JSZip();

    zip
      .loadAsync(zipFile[0])
      .then(
        zip => {
          return {
            selection: zip.file("selection.json").async("string"),
            ttfFile: zip.file("fonts/icomoon.ttf").async("blob")
          };
        },
        () => alert("Not a valid zip file")
      )
      .then(filePromises => {
        filePromises.ttfFile.then(ttfFile => {
          filePromises.ttfFile.then(ttfFile => {
            var reader = new FileReader();

            reader.onloadend = function() {
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
            reader.readAsDataURL(ttfFile);
          });
        });
        filePromises.selection.then(selectionFile => {
          const icons = JSON.parse(selectionFile).icons;
          Icon = createIconSetFromIcoMoon(JSON.parse(selectionFile));
          this.setState({ iconNames: icons.map(icon => icon.properties.name) });
          this.forceUpdate();
        });
      });
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
          style={{
            width: "90%",
            borderWidth: 2,
            borderColor: "#666",
            borderStyle: "dashed",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <p style={{ textAlign: "center" }}>Drop Icomoon ZIP here</p>
        </Dropzone>
        <View style={styles.parameters}>
          <View style={styles.parameter}>
            <Text>Montrer les icones originales</Text>
            <ToggleButton
              value={!this.state.crop}
              onToggle={value => this.setState({ crop: value })}
            />
          </View>
          <View style={styles.parameter}>
            <Text>Montrer les bords des icônes</Text>
            <ToggleButton
              value={this.state.showBorder}
              onToggle={value => this.setState({ showBorder: !value })}
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
          <View style={styles.parameter}>
            <View style={styles.colorPicker}>
              <label htmlFor="backgroundColor">Couleur d'arrière plan</label>
              <input
                id="backgroundColor"
                type="color"
                value={this.state.backgroundColor}
                onChange={this._onBackgroundColorChange}
              />
            </View>
            <View style={styles.colorPicker}>
              <label htmlFor="iconsColor">Couleur des icônes</label>
              <input
                id="iconsColor"
                type="color"
                value={this.state.iconsColor}
                onChange={this._onIconsColorChange}
              />
            </View>
          </View>
        </View>
        <View style={styles.iconsWrapper}>
          {this.state.iconNames.map((iconName, index) => (
            <View
              key={index}
              style={[
                this.state.showBorder
                  ? {
                      margin: this.state.iconSize / 10,
                      borderWidth: 1,
                      borderColor: "#000000"
                    }
                  : { margin: this.state.iconSize / 10 + 1 }
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
          ))}
        </View>
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
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  iconsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  header: {
    padding: 20
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginVertical: "1em",
    textAlign: "center"
  }
});

export default App;
