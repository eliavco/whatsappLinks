import * as WebBrowser from "expo-web-browser";
import React, { useEffect, Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Clipboard,
  TouchableOpacity,
  TextInput,
  Linking
} from "react-native";
import * as Contacts from "expo-contacts";
import Selectbox from "./components/selectContact";
import { render } from "react-dom";

export default function App() {
  return (
    <View style={styles.container}>
      <ARCHI></ARCHI>
    </View>
  );
}

class ARCHI extends Component {
  constructor(props) {
    super();
    this.selection = React.createRef();
    this.state = {
      data: [],
      number: "000000000",
	  message: "",
	  encoded: 'MESSAGE',
      contactList: [],
      rtl: false
    };
  }

  updateNum(ans) {
    this.setState({ number: ans });
  }

  findPhone(contact) {
    if (contact.phoneNumbers) {
      let phone = contact.phoneNumbers[0].number;
      if (phone.startsWith("+")) phone = phone.substring(1);
      if (phone.startsWith("0")) phone = "972" + phone.substring(1);
      phone = phone.replace(/\s/g, "");
      phone = phone.replace(/-/g, "");
      return phone;
    }
    // if (contact.phoneNumbers) {
    // 	let phone = '';
    // 	contact.phoneNumbers.forEach(phoneNumber => {
    // 		if (phoneNumber.isPrimary === 1) phone = phoneNumber.number;
    // 	});
    // 	return phone;
    // }
    return "";
  }

  makeContactList() {
    const data = this.state.data;
    const final = [];
    let name;
    let pNum;
    data.forEach(contact => {
      name = "";
      if (contact.firstName) name += contact.firstName;
      if (contact.middleName) name += ` ${contact.middleName}`;
      if (contact.lastName) name += ` ${contact.lastName}`;
      pNum = this.findPhone(contact);
      final.push({ item: name, id: `${final.length}`, num: pNum });
    });
    this.setState({ contactList: final });
    this.selection.current.setState({ values: final });
  }

  componentDidMount() {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync();
        this.setState({ data });
        this.makeContactList();
      }
    })();
  }

  copyString() {
    Clipboard.setString(
      `https://wa.me/${this.state.number}?text=${this.state.encoded}`
    );
  }

  sendMessage() {
	  WebBrowser.openBrowserAsync(
      `https://wa.me/${this.state.number}?text=${this.state.encoded}`
    );
  }

  editMessage(val) {
    let message = val.nativeEvent.text;
    const hebrewLetters = [
      "א",
      "ב",
      "ג",
      "ד",
      "ה",
      "ו",
      "ז",
      "ח",
      "ט",
      "י",
      "כ",
      "ל",
      "מ",
      "נ",
      "ס",
      "ע",
      "פ",
      "צ",
      "ק",
      "ר",
      "ש",
      "ת",
      "ם",
      "ן",
      "ך",
      "ף",
      "ץ"
	];
	let hebrew = false;
	hebrewLetters.forEach(hebrewLetter => {
		if (message.charAt(0) === hebrewLetter) hebrew = true;
	});
	const encoded = encodeURIComponent(message)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
    this.setState({ message, encoded, rtl: hebrew });
  }

  emptyMessage() {
    this.setState({ message: "", encoded: "" });
  }

  render() {
    return (
      <View>
        <Selectbox
          ansMethod={this.updateNum.bind(this)}
          contactList={this.state.contactList}
          ref={this.selection}
        />

        <ScrollView>
          <View>
            <TouchableOpacity onPress={this.copyString.bind(this)}>
              <Text style={styles.text} selectable={true}>
                https://wa.me/{this.state.number}?text={this.state.encoded}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.sendMessage.bind(this)}>
              <Text style={styles.button}>SEND</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.copyString.bind(this)}>
              <Text style={styles.button}>COPY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.emptyMessage.bind(this)}>
              <Text style={styles.button}>CLEAR</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textPad(this.state.rtl ? "right" : "left")}
              value={this.state.message}
              onChange={this.editMessage.bind(this)}
              multiline={true}
              placeholder={"message"}
            ></TextInput>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    textAlign: "justify",
    margin: 40,
    backgroundColor: "#07848933"
  },
  button: {
	textAlign: "center",
	margin: 5,
    width: 60,
    padding: 5,
    borderRadius: 50,
    alignSelf: "center",
    backgroundColor: "#124b5f",
    color: "#fff"
  },
  textPad: direction => {
    return {
      textAlign: direction,
      margin: 40,
      backgroundColor: "#f7f1e3",
      paddingBottom: 20,
      marginBottom: 400
    };
  }
});
