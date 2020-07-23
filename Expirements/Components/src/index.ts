import {TestComponent} from "./testComponent";

TestComponent.register(customElements);

let comp = document.querySelector("#testComponent") as TestComponent;
//comp.title = "aap";