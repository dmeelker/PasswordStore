import {v4 as uuid} from "uuid";

export type GroupVisitor = (group: PasswordGroup) => void;
export type EntryVisitor = (entry: PasswordEntry) => void;

export class PasswordGroup {
    public instanceId = uuid();
    public id: string = uuid();
    public isRecycleBin = false;
    public parent?: PasswordGroup;
    public groups = new Array<PasswordGroup>();
    public entries = new Array<PasswordEntry>();

    constructor (public name: string) {
    }

    public clone(): PasswordGroup {
        let clone = new PasswordGroup(this.name);
        clone.id = this.id;
        clone.isRecycleBin = this.isRecycleBin;
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

    public containsEntry(entry: PasswordEntry): boolean {
        if (this.entries.indexOf(entry) !== -1) {
            return true;
        } else {
            return this.groups.filter((g) => g.containsEntry(entry)).length > 0;
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

    public findGroupByName(name: string) : PasswordGroup | null {
        let group: PasswordGroup | null = null;
        const startGroup = this;

        this.visitGroup(this, (g) => {
            if(g !== startGroup && g.name === name) {
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

    public findRecycleBin() : PasswordGroup | null {
        let group: PasswordGroup | null = null;
        const startGroup = this;

        this.visitGroup(this, (g) => {
            if(g.isRecycleBin) {
                group = g;
            }
        });

        return group;
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
    public history: HistoryEntry[] = [];

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
        clone.history = this.history.map(item => item.clone());
        return clone;
    }

    public containsUrl(): boolean {
        return this.url != null && this.url.trim().length > 0;
    }

    public addHistoryItem(entry: HistoryEntry) {
        if(this.history.length > 0) {
            entry.updateChangeSummary(this.history[0]);
        } else {
            entry.updateChangeSummary(null);
        }

        this.history.splice(0, 0, entry);
    }
};

export class HistoryEntry {
    public id: string = uuid();
    public date: Date = new Date();
    public name: string = "";
    public username: string = "";
    public url: string = "";
    public password: string = "";
    
    public changes: string | null = "";

    public static createFromEntry(entry: PasswordEntry): HistoryEntry {
        const history = new HistoryEntry();
        history.name = entry.name;
        history.username = entry.username;
        history.url = entry.url;
        history.password = entry.password;

        return history;
    }

    public clone(): HistoryEntry {
        const clone = new HistoryEntry();
        clone.id = this.id;
        clone.date = this.date;
        clone.name = this.name;
        clone.username = this.username;
        clone.url = this.url;
        clone.password = this.password;
        clone.changes = this.changes;
        return clone;
    }

    public updateChangeSummary(previousEntry: HistoryEntry | null) {
        if (previousEntry === null) {
            this.changes = "First version";
            return;
        } else {
            const changedFields = new Array<string>();
            if (this.name !== previousEntry.name)
                changedFields.push("name");

            if (this.username !== previousEntry.username)
                changedFields.push("user name");

            if (this.url !== previousEntry.url)
                changedFields.push("url");

            if (this.password !== previousEntry.password)
                changedFields.push("password");
            
            if (changedFields.length > 0)
                this.changes = "Changed " + changedFields.join(", ");
            else
                this.changes = null;
        }
    }
}