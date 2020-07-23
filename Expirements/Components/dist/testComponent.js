define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestComponent = void 0;
    const htmlTemplate = `
    <div class="header">Head</div>
    <div class="content">Content</div>
`;
    class TestComponent extends HTMLElement {
        constructor() {
            var _a;
            super();
            let shadow = this.attachShadow({ mode: "open" });
            shadow.innerHTML = htmlTemplate;
            this._headerLabel = shadow.querySelector(".header");
            this._contentPanel = shadow.querySelector(".content");
            this._contentPanel.innerHTML = this.innerHTML;
            this.title = (_a = this.getAttribute("title")) !== null && _a !== void 0 ? _a : "Empty";
        }
        static register(customElements) {
            customElements.define('test-component', TestComponent);
        }
        get title() {
            return this._headerLabel.innerText;
        }
        set title(newTitle) {
            this._headerLabel.innerText = newTitle;
        }
    }
    exports.TestComponent = TestComponent;
});
