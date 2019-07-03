import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import config from "../config/firebase-config";

class App extends Component() {
  constructor() {
    super();

    // Initialize Firebase
    firebase.initializeApp(config);
    firebase.firestore().settings({
      timestampsInSnapshots: true
    });
  }

  render() {
    return <div>Hello React</div>;
  }
}

export default App;
