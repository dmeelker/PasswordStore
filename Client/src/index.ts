/// <reference path="./types/html.d.ts"/>

import "./style.css";
import {getHello} from "./component/mod";
import * as model from "./model/passwordRepository";
import * as Screen from "./screens/screen";
import LoginScreen from "./screens/login/loginScreen";

import * as CryptoJs from "crypto-js";

const element = document.createElement('div');
element.id = "main-container";
document.body.appendChild(element);

Screen.setScreenContainer(element);
Screen.setActiveScreen(new LoginScreen());

// let cypherText = CryptoJs.AES.encrypt("TEST TEST", "KEY");
// let decoded = CryptoJs.AES.decrypt(cypherText, "KEY");
