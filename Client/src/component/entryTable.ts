import * as Model from "../model/passwordRepository";

export default class EntryTable extends HTMLElement {
    private _passwordGroup: Model.PasswordGroup;

    static register(customElements: CustomElementRegistry) {
        customElements.define('entry-table', EntryTable);
    }

    constructor() {
        super();
    }

    private update() {
        this.innerHTML = "";
        let table = document.createElement("table");

        for(let entry of this._passwordGroup.entries) {
            table.appendChild(this.createRow(entry));
        }

        this.appendChild(table);
    }

    private createRow(entry: Model.PasswordEntry) : HTMLTableRowElement {
        let row = document.createElement("tr");
        row.appendChild(this.createCell(entry.name));
        row.appendChild(this.createCell(entry.password));
        return row;
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
