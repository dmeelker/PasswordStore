import { PasswordGroup, PasswordEntry, HistoryEntry } from "./Model";
import { Observable } from "./Observable";
import NotificationService from "../Services/NotificationService";
import * as Api from "../Services/ApiService";
import { convertApiGroupToModel, convertToApiModelGroup } from "../Utilities/ModelConverter";
import { CsvImporter } from "../Utilities/CsvImporter";

class EntryService {
    readonly root = new Observable<PasswordGroup>(new PasswordGroup("root"));
    private _documentVersion: number = 0;

    public addSubGroup(newGroup: PasswordGroup, targetGroupId: string) {
        const newRoot = this.root.get().clone();
        const parent = newRoot.findGroupById(targetGroupId);

        if(parent === null)
            return;

        parent.addGroup(newGroup);
        this.replaceRoot(newRoot);
    }

    public renameGroup(groupId: string, newName: string) {
        const newRoot = this.root.get().clone();
        const group = newRoot.findGroupById(groupId);

        if (group === null || newName.trim().length === 0)
            return;

        group.name = newName;
        if(group.parent) {
            group.parent.sortGroups();
        }
        this.replaceRoot(newRoot);
    }

    public moveGroup(groupId: string, targetGroupId: string) {
        const newRoot = this.root.get().clone();
        const group = newRoot.findGroupById(groupId);
        const targetGroup = newRoot.findGroupById(targetGroupId);

        if (group === null || targetGroup === null)
            return;

        if (!this.canGroupBeMoved(group, targetGroup))
            return;

        if(group.parent !== undefined)
            group.parent.removeGroup(group);
        
        targetGroup.addGroup(group);
        
        this.replaceRoot(newRoot);
    }

    private canGroupBeMoved(groupToMove: PasswordGroup, targetGroup: PasswordGroup) {
        if (groupToMove === targetGroup)
            return false;

        if (groupToMove.containsGroup(targetGroup))
            return false;

        if (groupToMove.parent === targetGroup)
            return false;

        return true;
    }

    public removeGroup(groupId: string) {
        const newRoot = this.root.get().clone();
        const recycleBin = newRoot.findRecycleBin();
        const group = newRoot.findGroupById(groupId);

        if (group === null)
            return;
        
        const groupInRecycleBin = recycleBin?.containsGroup(group);

        if(group.parent) {
            group.parent.removeGroup(group);
        }
        
        if (!groupInRecycleBin) {
            recycleBin?.addGroup(group);
        }

        this.replaceRoot(newRoot);
    }

    public addEntry(entry: PasswordEntry, groupId: string) {
        const newRoot = this.root.get().clone();
        const targetGroup = newRoot.findGroupById(groupId);

        entry.addHistoryItem(HistoryEntry.createFromEntry(entry));

        if(targetGroup !== null) {
            targetGroup.add(entry);
            this.replaceRoot(newRoot);
        }
    }

    public updateEntry(updatedEntry: PasswordEntry) {
        const newRoot = this.root.get().clone();
        const originalEntry = newRoot.findEntryById(updatedEntry.id)

        if(originalEntry === null)
            return;

        updatedEntry.addHistoryItem(HistoryEntry.createFromEntry(updatedEntry));
        console.log(updatedEntry);
        const group = originalEntry.group;
        group.remove(originalEntry);
        group.add(updatedEntry);

        this.replaceRoot(newRoot);
    }

    public moveEntry(entryId: string, targetGroupId: string) {
        const newRoot = this.root.get().clone();
        const entry = newRoot.findEntryById(entryId);
        const targetGroup = newRoot.findGroupById(targetGroupId);

        if (!entry || !targetGroup)
            return;

        entry.group.remove(entry);
        targetGroup.add(entry);

        this.replaceRoot(newRoot);
    }

    public removeEntry(entryId: string) {
        const newRoot = this.root.get().clone();
        const entry = newRoot.findEntryById(entryId);
        const recycleBin = newRoot.findRecycleBin();

        if (entry === null)
            return;

        const entryInRecycleBin = recycleBin?.containsEntry(entry);

        const group = entry.group;
        group.remove(entry);

        if (!entryInRecycleBin) {
            recycleBin?.add(entry);
        }

        this.replaceRoot(newRoot);
    }

    public clear() {
        this.root.set(new PasswordGroup("root"));
    }

    public new(name: string) {     
        const newRoot = new PasswordGroup(name);
        const recycleBin = new PasswordGroup("Recycle bin");
        recycleBin.isRecycleBin = true;
        newRoot.addGroup(recycleBin);

        this.replaceRoot(newRoot);
    }

    public importFromCsv(csvInput: string) {
        const newRoot = this.root.get().clone();

        const importer = new CsvImporter();
        importer.import(csvInput, newRoot);

        this.replaceRoot(newRoot);
    }

    public load(apiDocument: Api.Document) {
        const root = convertApiGroupToModel(apiDocument.root);
        this.root.set(root);
    }

    private replaceRoot(newRoot: PasswordGroup) {
        this.root.set(newRoot);
        this.save();
    }

    public async save() {
        const document = new Api.Document();
        document.format = 1;
        document.version = ++this._documentVersion;
        document.root = convertToApiModelGroup(this.root.get());

        await Api.savePasswords(document).then((result) => {
            NotificationService.showNotification("Changes saved");
        });
    }

    public searchEntries(searchTerms: string): PasswordEntry[] {
        const matches = new Array<PasswordEntry>();
        const expression = new RegExp(searchTerms, "i")
    
        this.root.get().visitEntries(this.root.get(), (entry) => {
            if(entry.name.match(expression)) {
                matches.push(entry);
            }
        })

        return matches.sort((a, b) => a.name.localeCompare(b.name));
    }
}

export default new EntryService();