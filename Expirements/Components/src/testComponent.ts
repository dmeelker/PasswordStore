const htmlTemplate = `
    <div class="header">Head</div>
    <div class="content">Content</div>
`;

export class TestComponent extends HTMLElement {
    private _headerLabel: HTMLElement;
    private _contentPanel: HTMLElement;

    static register(customElements) {
        customElements.define('test-component', TestComponent);
    }

    constructor() {
        super();

        let shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = htmlTemplate;

        this._headerLabel = shadow.querySelector(".header");
        this._contentPanel = shadow.querySelector(".content");

        this._contentPanel.innerHTML = this.innerHTML;

        this.title = this.getAttribute("title") ?? "Empty";
    }

    get title(): string {
        return this._headerLabel.innerText;
    }

    set title(newTitle: string) {
        this._headerLabel.innerText = newTitle;
    }
}
