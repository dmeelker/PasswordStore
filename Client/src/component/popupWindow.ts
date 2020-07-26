import template from "./popupWindow.html";
import "./popupWindow.less";

interface PopupSettings {
    title?: string;
    width?: number;
    height?: number;
}

export class PopupWindow extends HTMLElement {
    private _overlay: HTMLElement;
    private _titleLabel: HTMLElement;
    private _contentPanel: HTMLElement;
    private _buttonPanel: HTMLElement;

    static register(customElements: CustomElementRegistry) {
        customElements.define('popup-window', PopupWindow);
    }

    static showMessageBox(message: string, settings?: PopupSettings) : Promise<any> {
        return new Promise((resolve, reject) => {
            let popup = new PopupWindow();
            popup.create(settings ?? {});
            popup.content.innerText = message;
            popup.addDefaultButton("Ok", () => {
                popup.dispose();
                resolve();
            });
            popup.show();
        });
    }

    static showInputbox(message: string, settings?: PopupSettings) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let popup = new PopupWindow();
            popup.create(settings ?? {});

            popup.content.innerHTML = `
                <div class="message"></div>
                <input type="text" style="width: 100%; margin-top: 0.3em;"/>
            `;

            let messageLabel = popup.content.querySelector(".message") as HTMLElement;
            let inputField = popup.content.querySelector("input") as HTMLInputElement;
            
            messageLabel.innerText = message;

            popup.addDefaultButton("Ok", () => {
                popup.dispose();
                resolve(inputField.value);
            });

            popup.addButton("Cancel", () => {
                popup.dispose();
                reject();
            });

            popup.show();
            inputField.focus();
        });
    }

    constructor() {
        super();
    }

    public connectedCallback() {
        this.innerHTML = template;
        this._titleLabel = this.select(".window-title");
        this._contentPanel = this.select(".window-content");
        this._buttonPanel = this.select(".button-bar");
    }

    private select(name: string) : HTMLElement {
        return this.querySelector(name);
    }

    public create(settings: PopupSettings) {
        this._overlay = document.createElement("div");
        this._overlay.className = "popup-overlay";
        document.body.appendChild(this._overlay);

        document.body.appendChild(this);

        if (settings.width)
            this.style.width = settings.width + "px";
        
        if (settings.height)
            this.style.height = settings.height + "px";
        
        if (settings.title)
            this._titleLabel.innerText = settings.title;

        this.hide();
    }

    public clearButtons() {
        this._buttonPanel.innerHTML = "";
    }

    public addDefaultButton(label: string, callback: (ev: MouseEvent) => any) {
        let button = document.createElement("input");
        button.type = "submit";
        button.value = label;
        button.addEventListener("click", callback);
        this._buttonPanel.appendChild(button);
    }

    public addButton(label: string, callback: (ev: MouseEvent) => any) {
        let button = document.createElement("button");
        button.innerText = label;
        button.addEventListener("click", callback);
        this._buttonPanel.appendChild(button);
    }

    public show() {
        this.style.display = null;
    }

    public hide() {
        this.style.display = "none";
    }

    public dispose() {
        document.body.removeChild(this);
        document.body.removeChild(this._overlay);
    }

    public set title(title: string) {
        this._titleLabel.innerText = title;
    }

    public get content() : HTMLElement {
        return this._contentPanel;
    }

    public get buttonPanel() : HTMLElement {
        return this._buttonPanel;
    }
}