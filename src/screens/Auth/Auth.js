import React, { Component } from 'react';
import { View, ImageBackground, KeyboardAvoidingView, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';

import startMainTabs from '../MainTabs/startMainTabs';
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWIthBackground';
import backgroundImage from '../../assets/background.jpg';
import validate from '../../utiliy/validation';

import { connect } from 'react-redux';
import { tryAuth } from '../../store/actions';

class AuthScreen extends Component {
    state = {
        viewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        controls: {
            email: {
                value: "",
                valid: false,
                validationRules: {
                    isEmail: true
                },
                touched: false
            },
            password: {
                value: "",
                valid: false,
                validationRules: {
                    minLength: true
                },
                touched: false
            },
            confirmPassword: {
                value: "",
                valid: false,
                validationRules: {
                    equalTo: "password"
                },
                touched: false
            }
        },
        authMode: "Login"
    };

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

    loginHandler = () => {
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        };

        this.props.tryAuth(authData);
        startMainTabs();
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                authMode: prevState.authMode === "Login" ? "Signup" : "Login"
            };
        });
    }

    updateInputState = (key, value) => {
        let connectedValue = {};
        if (this.state.controls[key].validationRules.equalTo) {
            const equalControl = this.state.controls[key].validationRules.equalTo;
            const equalValue = this.state.controls[equalControl].value;
            connectedValue = {
                ...connectedValue,
                equalTo: equalValue
            };
        }
        if (key === "password") {
            connectedValue = {
                ...connectedValue,
                equalTo: value
            };
        }
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    confirmPassword: {
                        ...prevState.controls.confirmPassword,
                        valid:
                            key === "password"
                                ? validate(
                                    prevState.controls.confirmPassword.value,
                                    prevState.controls.confirmPassword.validationRules,
                                    connectedValue
                                )
                                : prevState.controls.confirmPassword.valid
                    },
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(
                            value,
                            prevState.controls[key].validationRules,
                            connectedValue
                        ),
                        touched: true
                    }
                }
            };
        });
    };

    render() {
        let headingText = null;
        let confirmPasswordControl = null;

        if (this.state.viewMode === "portrait") {
            headingText = (
                <MainText>
                    <HeadingText>Please Log In</HeadingText>
                </MainText>
            );
        }

        if (this.state.authMode === "Signup") {
            confirmPasswordControl = (
                <View style={
                    this.state.viewMode === "portrait" ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper
                }>
                    <DefaultInput
                        placeholder='Confirm Password'
                        style={styles.input}
                        onChangeText={(val) => this.updateInputState('confirmPassword', val)}
                        valid={this.state.controls.confirmPassword.valid}
                        touched={this.state.controls.confirmPassword.touched}
                        secureTextEntry
                    />
                </View>
            );
        }

        return (
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    {headingText}
                    <ButtonWithBackground color="#29aaf4" onPress={this.switchAuthModeHandler}>
                        Switch To {this.state.authMode}
                    </ButtonWithBackground>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inputContainer}>
                            <DefaultInput
                                placeholder='Your Email Address'
                                style={styles.input}
                                value={this.state.controls.email.value}
                                onChangeText={(val) => this.updateInputState('email', val)}
                                valid={this.state.controls.email.valid}
                                touched={this.state.controls.email.touched}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                            />
                            <View style={
                                this.state.viewMode === "portrait" || this.state.authMode === "Login" ? styles.portraitPasswordContainer : styles.landscapePasswordContainer
                            }>
                                <View style={
                                    this.state.viewMode === "portrait" || this.state.authMode === "Login" ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper
                                }>
                                    <DefaultInput
                                        placeholder='Password'
                                        style={styles.input}
                                        onChangeText={(val) => this.updateInputState('password', val)}
                                        valid={this.state.controls.password.valid}
                                        touched={this.state.controls.password.touched}
                                        secureTextEntry
                                    />
                                </View>
                                {confirmPasswordControl}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <ButtonWithBackground
                        color="#29aaf4"
                        onPress={this.loginHandler}
                        disabled={!this.state.controls.email.valid || !this.state.controls.password.valid || (!this.state.controls.confirmPassword.value && this.state.authMode === "Signup")}
                    >
                        Submit
                    </ButtonWithBackground>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    backgroundImage: {
        width: "100%",
        flex: 1
    },
    inputContainer: {
        width: "80%"
    },
    landscapePasswordContainer: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    portraitPasswordContainer: {
        flexDirection: 'column',
        justifyContent: "flex-start"
    },
    input: {
        backgroundColor: "#eee",
        borderColor: "#bbb"
    },
    landscapePasswordWrapper: {
        width: "45%"
    },
    portraitPasswordWrapper: {
        width: "100%"
    }
});

export default connect(null, { tryAuth })(AuthScreen);