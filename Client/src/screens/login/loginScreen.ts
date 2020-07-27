import template from "./template.html";
import * as Api from "../../api";
import * as Screen from "../screen";
import * as Model from "../../model/passwordRepository";
import RepositoryOverviewScreen from "../repositoryOverview/repositoryOverview";

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
        this.formSubmitted(new CustomEvent("aap"));
    }

    public close() {

    }

    private async formSubmitted(event: Event) {
        event.preventDefault();
        console.log(`Submit! ${this._usernameField.value} ${this._passwordField.value}`);

        let repository = await Model.PasswordRepository.load(this._usernameField.value, this._passwordField.value);
        Screen.setActiveScreen(new RepositoryOverviewScreen(repository));
    }
}