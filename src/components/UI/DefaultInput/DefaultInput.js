// separate input component used for rendering input style
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const defaultInput = props => (
    <TextInput
        placeholder={props.placeholder}
        underlineColorAndroid="transparent"
        {...props}
        style={[styles.input, props.style, !props.valid && props.touched ? styles.inValid : null]}
    />
);

const styles = StyleSheet.create({
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#eee",
        padding: 5,
        marginTop: 8,
        marginBottom: 8
    },
    inValid: {
        backgroundColor: '#f9c0c0',
        borderColor: 'red'
    }
});

export default defaultInput;