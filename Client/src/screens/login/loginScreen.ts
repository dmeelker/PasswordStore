import template from "./template.html";
import * as Api from "../../api";
import * as Screen from "../screen";
import RepositoryOverviewScreen from "../repositoryOverview/repositoryOverview";
import JsonRepositoryParser from "../../model/json/jsonRepositoryParser";


export default class LoginScreen implements Screen.IScreen {
    private _container: HTMLElement;
    private _usernameField: HTMLInputElement;
    private _passwordField: HTMLInputElement;

    public show(container: HTMLElement) {
        this._container = container;
        this._container.innerHTML = template;

        let form = this._container.querySelector("#login-form") as HTMLFormElement;
        this._usernameField = this._container.querySelector("#username");        
        this._passwordField = this._container.querySelector("#password");

        form.addEventListener("submit", (event) => this.formSubmitted(event));
    }

    public close() {

    }

    private async formSubmitted(event: Event) {
        event.preventDefault();
        console.log(`Submit! ${this._usernameField.value} ${this._passwordField.value}`);

        let repositoryData = await Api.loadRepository();
        let parsed = JsonRepositoryParser(repositoryData);

        console.log(repositoryData);
        Screen.setActiveScreen(new RepositoryOverviewScreen(parsed));
    }
}