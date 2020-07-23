export interface NamedItem {
    name: string;
}

export class Group {
    public children: NamedItem[];
    constructor(public name: string) {
        this.children = new Array<NamedItem>();
    }
}

export class PasswordEntry {
    constructor(public name: string) {

    }
}