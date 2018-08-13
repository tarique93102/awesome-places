import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions
} from "react-native";
import { connect } from 'react-redux';

import Icon from "react-native-vector-icons/Ionicons";
import { deletePlace } from '../../store/actions';

import MapView from 'react-native-maps';

class PlaceDetail extends Component {
  state = {
    viewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape"
  }

  constructor(props) {
    super(props);

    Dimensions.addEventListener("change", this.updateStyles);
  }


  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateStyles);
  }

  updateStyles = () => {
    this.setState({
      viewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape"
    });
  }

  placeDeletedHandler = () => {
    this.props.deletePlace(this.props.selectedPlace.key);
    this.props.navigator.pop();
  }

  render() {
    console.log()
    return (
      <View style={this.state.viewMode === "portrait" ? styles.portraitContainer : styles.landscapeContainer}>
        <View style={styles.placeDetailContainer}>
          <View style={styles.subContainer}>
            <Image source={this.props.selectedPlace.image} style={styles.placeImage} />
          </View>
          <View style={styles.subContainer}>
            <MapView
              initialRegion={{
                ...this.props.selectedPlace.location,
                latitudeDelta: 0.0122,
                longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.0122
              }}
              style={styles.map}
              ref={(ref) => this.map = ref}
            >
              <MapView.Marker coordinate={this.props.selectedPlace.location} />
            </MapView>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View>
            <Text style={styles.placeName}>{this.props.selectedPlace.name}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={this.placeDeletedHandler}>
              <View style={styles.deleteButton}>
                <Icon
                  size={30}
                  name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
                  color="red"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 22,
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  portraitContainer: {
    flexDirection: "column",
    margin: 22,
    flex: 1
  },
  landscapeContainer: {
    flexDirection: "row",
    margin: 22,
    flex: 1
  },
  placeImage: {
    width: "100%",
    height: "100%"
  },
  placeDetailContainer: {
    flex: 2
  },
  placeName: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  },
  deleteButton: {
    alignItems: "center"
  },
  subContainer: {
    flex: 1
  }
});

export default connect(null, { deletePlace })(PlaceDetail);
