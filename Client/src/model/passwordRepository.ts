import * as Api from "../api";
import JsonRepositoryParser from "../model/json/jsonRepositoryParser";
import JsonRepositoryGenerator from "../model/json/jsonRepositoryGenerator";

export class PasswordGroup {
    public childGroups: PasswordGroup[];
    public entries: PasswordEntry[];

    constructor(public name: string) {
        this.childGroups = new Array<PasswordGroup>();
        this.entries = new Array<PasswordEntry>();
    }
}

export class PasswordEntry {
    constructor(public name: string, public username: string, public password: string) {

    }
}

export class PasswordRepository {
    private _root: PasswordGroup;

    constructor(root: PasswordGroup) {
        this._root = root;
    }

    public static async load(username: string, password: string) : Promise<PasswordRepository> {
        let apiDocument = await Api.loadRepository();
        return new PasswordRepository(JsonRepositoryParser(apiDocument));
    }

    public async save(username: string, password: string) {
        let apiModel = JsonRepositoryGenerator(this._root);
        Api.saveRepository(apiModel);
    }

    get root() : PasswordGroup {
        return this._root;
    }
}