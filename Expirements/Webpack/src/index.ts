import "./style.css";
import {getHello} from "./component/mod";

console.log(getHello());

const element = document.createElement('div');

element.innerHTML = "HI";
element.classList.add('hello');
document.body.appendChild(element);