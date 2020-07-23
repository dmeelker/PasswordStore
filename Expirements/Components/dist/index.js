define(["require", "exports", "./testComponent"], function (require, exports, testComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    testComponent_1.TestComponent.register(customElements);
    let comp = document.querySelector("#testComponent");
});
//comp.title = "aap";
