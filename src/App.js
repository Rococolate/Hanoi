import React, { Component, Children } from "react";
import "./index.css";
import Hanoi from "./components/Hanoi/Hanoi.js";

const level = 7;

export default class App extends Component {
  
  constructor(){
    super();
    this.state = { 
    };
  }

  render (){
    return (
      <Hanoi level={level} />
    );
  } 
}

