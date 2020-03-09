import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeProvider } from "styled-components";
import SelectBox from "react-native-multi-selectbox";
import { xor } from "lodash";

const Colors = {
  primary: "#078489",
  secondary: "#124b5f",
  tertiary: "#f7f1e3"
};

export default class Selectbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedValues: [],
			values: props.contactList
		}
	}

	findNumForItem(item) {
		const options = this.state.values;
		let num = '';
		options.forEach(option => {
			if (option.item === item) num = option.num;
		});
		return num;
	}

	render() {
		const { values, selectedValues } = this.state;
		return (
			<View style={{maxWidth: 350, marginTop: 40}}>

		<ThemeProvider theme={Colors}>
			<View style={{ margin: 30, marginBottom: 0 }}>
			{/* <View style={{ width: "100%", alignItems: "center" }}>
				<Text style={{ fontSize: 30, paddingBottom: 20 }}>Demos</Text>
			</View> */}
			<Text style={{ fontSize: 20, paddingBottom: 10 }}>Please choose a</Text>
			<SelectBox
				label="contact"
				options={values}
				value={selectedValues[0]}
				onChange={val => {
					this.setState({ selectedValues: [val] });
            		this.props.ansMethod(this.findNumForItem(val));
				}}
				hideInputFilter={false}
				viewMargin="0 0 20px 0"
			/>

			</View>
		</ThemeProvider>
			</View>
		);
	}
}
