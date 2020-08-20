import {v4 as uuid} from "uuid";

export type GroupVisitor = (group: PasswordGroup) => void;
export type EntryVisitor = (entry: PasswordEntry) => void;

export class PasswordGroup {
    public instanceId = uuid();
    public id: string = uuid();
    public parent?: PasswordGroup;
    public groups = new Array<PasswordGroup>();
    public entries = new Array<PasswordEntry>();

    constructor (public name: string) {
    }

    public clone(): PasswordGroup {
        let clone = new PasswordGroup(this.name);
        clone.id = this.id;
        clone.parent = this.parent;
        clone.groups = this.groups.map((group) => group.clone());
        clone.entries = this.entries.map((entry) => entry.clone());

        clone.groups.forEach(g => g.parent = clone);
        clone.entries.forEach(e => e.group = clone);

        return clone;
    }

    public add(entry: PasswordEntry) {
        this.entries.push(entry);
        this.entries = this.entries.sort((a, b) => a.name.localeCompare(b.name));
        this.sort();
    }

    public remove(entry: PasswordEntry) {
        this.entries = this.entries.filter(e => e !== entry);
    }

    public addGroup(group: PasswordGroup) {
        this.groups.push(group);
        group.parent = this;
        this.sort();
    }

    public removeGroup(group: PasswordGroup) {
        this.groups = this.groups.filter(g => g !== group);
        group.parent = undefined;
    }

    public containsGroup(group: PasswordGroup): boolean {
        if (this.groups.indexOf(group) !== -1) {
            return true;
        } else {
            return this.groups.filter((g) => g.containsGroup(group)).length > 0;
        }
    }

    private sort() {
        this.sortGroups();
        this.entries = this.entries.sort((a, b) => a.name.localeCompare(b.name));
    }

    public sortGroups() {
        this.groups = this.groups.sort((a, b) => a.name.localeCompare(b.name));
    }

    public findGroupById(id: string) : PasswordGroup | null {
        let group: PasswordGroup | null = null;

        this.visitGroup(this, (g) => {
            if(g.id === id) {
                group = g;
            }
        });

        return group;
    }

    public findEntryById(id: string) : PasswordEntry | null {
        let entry: PasswordEntry | null = null;

        this.visitEntries(this, (e) => {
            if(e.id === id) {
                entry = e;
            }
        });

        return entry;
    }

    public visitGroup(group: PasswordGroup, visitor: GroupVisitor) {
        visitor(group);
        group.groups.forEach((g) => this.visitGroup(g, visitor));
    }

    public visitEntries(group: PasswordGroup, visitor: EntryVisitor) {
        group.entries.forEach(visitor);
        group.groups.forEach((g) => this.visitEntries(g, visitor));
    }
};

export class PasswordEntry {
    public group: PasswordGroup;
    public id: string = uuid();
    public name: string = "";
    public url: string = "";
    public username: string = "";
    public password: string = "";

    constructor(group: PasswordGroup) {
        this.group = group;
    }

    public clone() : PasswordEntry {
        let clone = new PasswordEntry(this.group);
        clone.id = this.id;
        clone.name = this.name;
        clone.url = this.url;
        clone.username = this.username;
        clone.password = this.password;
        return clone;
    }

    public containsUrl(): boolean {
        return this.url != null && this.url.trim().length > 0;
    }
};