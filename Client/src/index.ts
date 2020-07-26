/// <reference path="./types/html.d.ts"/>

import "./style.less";
import * as Screen from "./screens/screen";
import LoginScreen from "./screens/login/loginScreen";
import RepositoryOverview from "./screens/repositoryOverview/repositoryOverview";

import {PopupWindow} from "./component/popupWindow";

import * as CryptoJs from "crypto-js";

const element = document.createElement('div');
element.id = "main-container";
element.style.height = "100%";
document.body.appendChild(element);

Screen.setScreenContainer(element);
Screen.setActiveScreen(new LoginScreen());

registerComponents();

function registerComponents() {
    PopupWindow.register(customElements);
    RepositoryOverview.registerComponents(customElements);
}

// let cypherText = CryptoJs.AES.encrypt("TEST TEST", "KEY");
// let decoded = CryptoJs.AES.decrypt(cypherText, "KEY");
