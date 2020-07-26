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

    get root() : PasswordGroup {
        return this._root;
    }
}