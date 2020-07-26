import "./entryTable.less";

import * as Model from "../../../model/passwordRepository";
import {Clipboard} from 'ts-clipboard';

export default class EntryTable extends HTMLElement {
    private _passwordGroup: Model.PasswordGroup;
    private _selectedEntry: Model.PasswordEntry;

    static register(customElements: CustomElementRegistry) {
        customElements.define('entry-table', EntryTable);
    }

    constructor() {
        super();
    }

    private update() {
        this.innerHTML = "";
        let table = document.createElement("table");

        this.createHeader(table);

        let body = document.createElement("tbody");

        //for(let i=0; i<100; i++) {
            for(let entry of this._passwordGroup.entries) {
                body.appendChild(this.createRow(entry));
            }
        //}

        table.appendChild(body);
        this.appendChild(table);
    }

    private createHeader(table: HTMLTableElement) {
        let head = document.createElement("thead");
        let row = document.createElement("tr");
        let nameColumn = document.createElement("th");
        let userNameColumn = document.createElement("th");
        let actionsColumn = document.createElement("th");

        nameColumn.innerText = "Name";
        userNameColumn.innerText = "User Name";

        row.appendChild(nameColumn);
        row.appendChild(userNameColumn);
        row.appendChild(actionsColumn);
        head.appendChild(row);
        table.appendChild(head);
    }

    private createRow(entry: Model.PasswordEntry) : HTMLTableRowElement {
        let row = document.createElement("tr");
        row.appendChild(this.createCell(entry.name));
        row.appendChild(this.createCell(entry.password));

        let actionCell = document.createElement("td");
        let copyButton = document.createElement("button");
        copyButton.innerText = "Copy";
        copyButton.addEventListener("click", () => Clipboard.copy(entry.password));
        actionCell.appendChild(copyButton);
        row.appendChild(actionCell);

        for(let cell of row.querySelectorAll("td"))
            cell.addEventListener("click", () => this.rowClicked(row, entry));

        return row;
    }

    private rowClicked(row: HTMLTableRowElement, entry: Model.PasswordEntry) {
        this.clearSelectedRows();

        row.classList.add("selected");
        this._selectedEntry = entry;
        this.dispatchEvent(new CustomEvent("select", {detail: entry}));
    }

    private clearSelectedRows() {
        for (let row of this.querySelectorAll("tr"))
            row.classList.remove("selected");
    }

    private createCell(value: string) : HTMLTableCellElement {
        let cell = document.createElement("td");
        cell.innerText = value;
        return cell;
    }

    set passwordGroup(group: Model.PasswordGroup) {
        this._passwordGroup = group;
        this.update();
    }
}
