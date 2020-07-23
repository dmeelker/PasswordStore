import "./style.css";
import {getHello} from "./component/mod";
import * as model from "./passwordRepository";

console.log(getHello());

const element = document.createElement('div');

element.innerHTML = "HI";
element.classList.add('hello');
document.body.appendChild(element);

loadData();

async function loadData() {
    let options: RequestInit = {method: 'get'};
    let request = new Request('http://localhost:5000/repository?username=test', options);
    let response = await fetch(request);
    if(response.ok) {
        var content = await response.json();
        console.log(content);

        let x = new model.Group("Item");
        x.children.push(new model.PasswordEntry("stuff"));
        x.children.push(new model.Group("stuff2"));

    } else {
        console.log('Fetch Error :-S', response.statusText);
    }
}