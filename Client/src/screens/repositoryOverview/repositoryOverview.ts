import template from "./template.html";
import {IScreen} from "../screen";
import * as Model from "../../model/passwordRepository";
import GroupTree from "../../component/groupTree";
import EntryTable from "../../component/entryTable";

export default class RepositoryOverviewScreen implements IScreen {
    private _container: HTMLElement;
    private _passwordRepository: Model.PasswordRepository;
    private _groupTree: GroupTree;
    private _passwordList: EntryTable;

    constructor(passwordRepository: Model.PasswordRepository) {
        this._passwordRepository = passwordRepository;
    }

    public show(container: HTMLElement) {
        this._container = container;
        this._container.innerHTML = template;

        this._groupTree = this._container.querySelector("#group-tree") as GroupTree;
        this._groupTree.passwordRepository = this._passwordRepository;
        this._groupTree.addEventListener("select", (event: CustomEvent) => this.groupSelected(event.detail));

        this._passwordList = this._container.querySelector("#password-list");

        // let tree = this._container.querySelector("#group-tree") as HTMLElement;

        // this.populateTree(tree);
    }

    private groupSelected(group: Model.PasswordGroup) {
        console.log(`"Selected ${group.name}`);

        this._passwordList.passwordGroup = group;
        // this._passwordList.innerHTML = "";

        // for(let password of group.entries) {
        //     let element = document.createElement("div");
        //     element.innerText = password.name;
        //     this._passwordList.appendChild(element);
        // }
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