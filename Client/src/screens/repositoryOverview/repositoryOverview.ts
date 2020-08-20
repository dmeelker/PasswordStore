import template from "./template.html";
import "./style.less";
import {IScreen} from "../screen";
import * as Model from "../../model/passwordRepository";
import GroupTree from "./components/groupTree";
import EntryTable from "./components/entryTable";
import EntryEditor from "./components/entryEditor";

import {PopupWindow} from "../../component/popupWindow";

export default class RepositoryOverviewScreen implements IScreen {
    private _passwordRepository: Model.PasswordRepository;

    private _container: HTMLElement;

    private _newGroupButton: HTMLButtonElement;
    private _newEntryButton: HTMLButtonElement;

    private _groupTree: GroupTree;
    private _passwordList: EntryTable;
    private _entryEditor: EntryEditor;
    private _selectedEntry: Model.PasswordEntry;


    constructor(passwordRepository: Model.PasswordRepository) {
        this._passwordRepository = passwordRepository;
    }

    static registerComponents(customElements: CustomElementRegistry) {
        GroupTree.register(customElements);
        EntryTable.register(customElements);
        EntryEditor.register(customElements);
    }

    public show(container: HTMLElement) {
        this._container = container;
        this._container.innerHTML = template;

        this._newGroupButton = this._container.querySelector("#newGroupButton");
        this._newEntryButton = this._container.querySelector("#newEntryButton");

        this._groupTree = this._container.querySelector("#group-tree");
        this._groupTree.passwordRepository = this._passwordRepository;
        this._passwordList = this._container.querySelector("#password-list");
        this._entryEditor = this._container.querySelector("#entry-editor");

        this._newGroupButton.addEventListener("click", () => this.newGroupButtonClicked());
        this._groupTree.addEventListener("select", (event: CustomEvent) => this.groupSelected(event.detail));
        this._passwordList.addEventListener("select", (event: CustomEvent) => this.passwordEntrySelected(event.detail));

        let popup = document.createElement("popup-window") as PopupWindow;
        
        // popup.create(300, 300);
        // popup.title = "Apenkool";
        // popup.clearButtons();
        // popup.addButton("OK", () => {
        //     alert("BUTTON");
        //     popup.dispose();
        // });
        // popup.show();

        // PopupWindow.showMessageBox("Hello!", {width: 200})
        //     .then(() => {
        //         PopupWindow.showInputbox("Enter something!")
        //             .then((input: string) => alert(input))
        //             .catch(() => alert("nothing"));
        //     });

        //this._container.appendChild(popup);
    }

    private newGroupButtonClicked() {
        PopupWindow.showInputbox("What should the new group be called?", { title: "Create group"})
            .then((input: string) => {
                let newGroup = new Model.PasswordGroup(input);
                this._groupTree.selectedNode.childGroups.push(newGroup);
                this._groupTree.update();
                this._passwordRepository.save("test", "test");
                //this._groupTree.selectedNode = newGroup;
            });
    }
    
    private passwordEntrySelected(entry: Model.PasswordEntry) {
        console.log(entry);
        this._selectedEntry = entry;
        this._entryEditor.passwordEntry = entry;
    }

    private groupSelected(group: Model.PasswordGroup) {
        console.log(`"Selected ${group.name}`);
        this._passwordList.passwordGroup = group;
    }

    public close() {
        
    }

    private populateTree(tree: HTMLElement) {
        this.showGroup(this._passwordRepository.root, tree);
    }

    private showGroup(group: Model.PasswordGroup, container: HTMLElement) {
        let element = document.createElement("div");
        element.innerText = group.name;
        container.appendChild(element);

        for (let childGroup of group.childGroups) {
            this.showGroup(childGroup, element);
        }
    }
}