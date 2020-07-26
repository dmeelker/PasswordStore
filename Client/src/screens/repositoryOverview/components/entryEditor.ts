import "./entryEditor.less";

import template from "./entryEditor.html";
import * as Model from "../../../model/passwordRepository";

export default class EntryEditor extends HTMLElement {
    private _entry: Model.PasswordEntry;
    private _nameField: HTMLInputElement;
    private _usernameField: HTMLInputElement;
    private _passwordField: HTMLInputElement;
    private _saveButton: HTMLButtonElement;

    static register(customElements: CustomElementRegistry) {
        customElements.define('entry-editor', EntryEditor);
    }

    constructor() {
        super();
        this.innerHTML = template;
        
        this._nameField = this.querySelector("#nameField");
        this._usernameField = this.querySelector("#usernameField");
        this._passwordField = this.querySelector("#password1Field");
        this._saveButton = this.querySelector("#saveEntryButton");

        this._saveButton.addEventListener("click", (event) => this.saveButtonClicked());
    }

    private update() {
        this._nameField.value = this._entry.name;
        this._usernameField.value = this._entry.username;
        this._passwordField.value = this._entry.password;
    }

    set passwordEntry(entry: Model.PasswordEntry) {
        this._entry = entry;
        this.update();
    }

    private saveButtonClicked() {
        this._entry.name = this._nameField.value;
        this._entry.username = this._usernameField.value;
        this._entry.password = this._passwordField.value;
    }
}
