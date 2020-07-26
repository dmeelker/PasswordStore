import {PasswordRepository} from "../../../model/passwordRepository";
import * as Model from "../../../model/passwordRepository";
import "./groupTree.less";

export default class GroupTree extends HTMLElement {
    private _passwordRepository: PasswordRepository;
    private _selectedNode: TreeNode;

    static register(customElements: CustomElementRegistry) {
        customElements.define('group-tree', GroupTree);
        customElements.define('tree-node', TreeNode);
    }

    constructor() {
        super();
    }

    public update() {
        this.innerHTML = "";
        this.appendChild(this.createNode(this._passwordRepository.root));
    }



    private createNode(group: Model.PasswordGroup) : TreeNode {
        let node = new TreeNode();
        node.group = group;
        node.addEventListener("selected", (event: CustomEvent) => this.selectionChanged(event.detail as TreeNode));

        for(let subGroup of group.childGroups) {
            node.contentContainer.appendChild(this.createNode(subGroup));
        }

        return node;
    }

    private selectionChanged(newSelection: TreeNode) {
        if (this._selectedNode != null) {
            this._selectedNode.selected = false;
        }

        this._selectedNode = newSelection;
        this._selectedNode.selected = true;
        this.dispatchEvent(new CustomEvent("select", {detail: this._selectedNode.group}));
    }
    
    set passwordRepository(repository: PasswordRepository) {
        this._passwordRepository = repository;
        this.update();
    }

    get selectedNode() : Model.PasswordGroup {
        return this._selectedNode.group;
    }
}

class TreeNode extends HTMLElement {
    private _group: Model.PasswordGroup
    public nameElement: HTMLElement;
    public contentContainer: HTMLElement;
    private _selected: boolean = false;

    constructor() {
        super();

        this.className = "tree-node";

        this.nameElement = document.createElement("div");
        this.nameElement.className = "name";
        this.nameElement.addEventListener("click", (event) => this.groupSelected());
        this.appendChild(this.nameElement);

        this.contentContainer = document.createElement("div");
        this.contentContainer.className = "node-content";

        this.appendChild(this.contentContainer);
    }

    private groupSelected() {
        this.dispatchEvent(new CustomEvent("selected",{detail: this}));
    }

    set group(group: Model.PasswordGroup) {
        this._group = group;
        this.nameElement.innerText = group.name;
    }

    get group() : Model.PasswordGroup {
        return this._group;
    }

    set selected(selected: boolean) {
        this._selected = selected;
        
        if(selected)
            this.classList.add("selected");
        else
            this.classList.remove("selected");
    }

    get selected() : boolean {
        return this._selected;
    }
}