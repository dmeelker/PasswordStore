/// <reference path="./types/html.d.ts"/>

import "./style.css";
import {getHello} from "./component/mod";
import * as model from "./passwordRepository";
import * as Screen from "./screens/screen";
import LoginScreen from "./screens/login/loginScreen";

import * as CryptoJs from "crypto-js";

const element = document.createElement('div');
element.id = "main-container";
document.body.appendChild(element);

Screen.setScreenContainer(element);
Screen.setActiveScreen(new LoginScreen());

let cypherText = CryptoJs.AES.encrypt("TEST TEST", "KEY");
let decoded = CryptoJs.AES.decrypt(cypherText, "KEY");
// loadData();

// async function loadData() {
//     let options: RequestInit = {method: 'get'};
//     let request = new Request('http://localhost:5000/repository?username=test', options);
//     let response = await fetch(request);
//     if(response.ok) {
//         var content = await response.json();
//         console.log(content);

//         let x = new model.Group("Item");
//         x.children.push(new model.PasswordEntry("stuff"));
//         x.children.push(new model.Group("stuff2"));

//     } else {
//         console.log('Fetch Error :-S', response.statusText);
//     }
// }