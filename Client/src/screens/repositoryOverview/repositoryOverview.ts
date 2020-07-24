import template from "./template.html";
import {IScreen} from "../screen";
import * as Model from "../../model/passwordRepository";

export default class RepositoryOverviewScreen implements IScreen {
    private _container: HTMLElement;
    private _passwordRepository: Model.PasswordRepository;

    constructor(passwordRepository: Model.PasswordRepository) {
        this._passwordRepository = passwordRepository;
    }

    public show(container: HTMLElement) {
        this._container = container;
        this._container.innerHTML = template;

        let tree = this._container.querySelector("#group-tree") as HTMLElement;

        this.populateTree(tree);
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