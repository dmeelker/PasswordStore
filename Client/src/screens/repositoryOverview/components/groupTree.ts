import {PasswordRepository} from "../../../model/passwordRepository";
import * as Model from "../../../model/passwordRepository";
import "./groupTree.less";

export default class GroupTree extends HTMLElement {
    private _passwordRepository: PasswordRepository;
    private _rootNode: TreeNode;
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
        this._rootNode = this.createNode(this._passwordRepository.root);
        this.appendChild(this._rootNode);
        this.expandFirstLevel();
    }

    private createNode(group: Model.PasswordGroup) : TreeNode {
        let node = new TreeNode();
        node.group = group;
        node.addEventListener("selected", (event: CustomEvent) => this.selectionChanged(event.detail as TreeNode));

        for(let subGroup of group.childGroups) {
            node.addNode(this.createNode(subGroup));
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
    
    public collapseAll() {
        this.visitNodes((node, level) => node.expanded = false);
    }

    private expandFirstLevel() {
        this.visitNodes((node, level) => node.expanded = level < 1);
    }

    private visitNodes(visitor: (node: TreeNode, level: number) => any) {
        this.visitNode(this._rootNode, 0, visitor);
    }

    private visitNode(node: TreeNode, level: number, visitor: (node: TreeNode, level: number) => any) {
        visitor(node, level);

        for (let childNode of node.childTreeNodes) {
            this.visitNode(childNode, level+1, visitor);
        }
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
    private _expanded: boolean;
    private _parent?: TreeNode;
    private _children: TreeNode[] = [];

    constructor() {
        super();

        this.className = "tree-node";

        this.nameElement = document.createElement("div");
        this.nameElement.className = "name";
        this.nameElement.addEventListener("click", (event) => this.groupSelected());
        this.nameElement.addEventListener("dblclick", () => this.toggleExpanded());
        this.appendChild(this.nameElement);

        this.contentContainer = document.createElement("div");
        this.contentContainer.className = "node-content";

        this.appendChild(this.contentContainer);

        this.expanded = false;
    }

    private groupSelected() {
        this.dispatchEvent(new CustomEvent("selected", {detail: this}));
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

    set expanded(expanded: boolean) {
        this._expanded = expanded;

        if (expanded) {
            this.contentContainer.style.display = null;
            this.classList.add("expanded");
            this.classList.remove("collapsed");
        }
        else {
            this.contentContainer.style.display = "none";
            this.classList.add("collapsed");
            this.classList.remove("expanded");
        }
    }

    get expanded() : boolean {
        return this._expanded;
    }

    public toggleExpanded() {
        this.expanded = !this.expanded;
    }

    public get parentTreeNode() : TreeNode {
        return this._parent;
    }

    public set parentTreeNode(parent: TreeNode) {
        this._parent = parent;
    }

    public get childTreeNodes() : TreeNode[] {
        return this._children;
    }

    public addNode(node: TreeNode) {
        this.contentContainer.appendChild(node);
        this._children.push(node);
        node.parentTreeNode = this;
        this.updateHasChildrenClass();
    }

    private updateHasChildrenClass() {
        if (this._children.length > 0) {
            this.classList.add("haschildren");
        } else {
            this.classList.remove("haschildren");
        }
    }
}