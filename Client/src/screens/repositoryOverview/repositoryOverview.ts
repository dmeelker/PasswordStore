import template from "./template.html";
import {IScreen} from "../screen";

export default class RepositoryOverviewScreen implements IScreen {
    private _container: HTMLElement;

    public show(container: HTMLElement) {
        this._container = container;
        this._container.innerHTML = template;
    }

    public close() {
        
    }
}