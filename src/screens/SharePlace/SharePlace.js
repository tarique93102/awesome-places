import React, { Component } from 'react';
import { View, Button, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { addPlace } from '../../store/actions/places';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';
import validate from '../../utiliy/validation';

class SharePlaceScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: "orange"
    }

    constructor(props) {
        super(props);

        this.state = {
            controls: {
                placeName: {
                    value: "",
                    valid: false,
                    touched: false,
                    validationRules: {
                        notEmpty: true
                    }
                },
                location: {
                    value: null,
                    valid: false
                },
                image: {
                    value: null,
                    valid: false
                }
            }
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    }

    placeNameChangedHandler = val => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    placeName: {
                        ...prevState.controls.placeName,
                        value: val,
                        valid: validate(val, prevState.controls.placeName.validationRules),
                        touched: true
                    }
                }
            }
        });
    };

    placeAddedHandler = () => {
        this.props.addPlace(this.state.controls.placeName.value, this.state.controls.location.value, this.state.controls.image.value);
    }

    imagePickedHandler = image => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    image: {
                        ...prevState.controls.image,
                        value: image,
                        valid: true
                    }
                }
            };
        })
    }

    locationPickHandler = location => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    location: {
                        value: location,
                        valid: true
                    }
                }
            };
        });
    }

    render() {
        let submitButton = <Button
            title="Share The Place!"
            onPress={this.placeAddedHandler}
            disabled={!this.state.controls.placeName.valid || !this.state.controls.location.valid || !this.state.controls.image.value}
        />;

        if (this.props.isLoading) {
            submitButton = <ActivityIndicator />;
        }

        return (
            <ScrollView>
                <View style={styles.container}>
                    <MainText>
                        <HeadingText>Share a Place with us!</HeadingText>
                    </MainText>
                    <PickImage onImagePicked={this.imagePickedHandler} />
                    <PickLocation onLocationPick={this.locationPickHandler} />
                    <PlaceInput
                        placeData={this.state.controls.placeName}
                        onChangeText={this.placeNameChangedHandler}
                    />
                    <View style={styles.button}>
                        {submitButton}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    button: {
        margin: 8
    },
    previewImage: {
        width: "100%",
        height: "100%"
    },
    placeholder: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "#eee",
        width: "80%",
        height: 150
    }
});

mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading
    };
};

export default connect(mapStateToProps, { addPlace })(SharePlaceScreen);