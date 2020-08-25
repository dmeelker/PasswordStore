import { PasswordGroup, PasswordEntry } from "../Model/Model";
import { CsvParser, CsvEntry } from "./CsvParser";

export class CsvImporter {
    public import(csv: string, root: PasswordGroup) {
        const csvData = new CsvParser().parse(csv);

        for(const entry of csvData) {
            const groupNames = this.parseGroups(entry.group);
            const parentGroup = this.ensureGroupsExist(groupNames, root);
            const newEntry = this.createEntry(parentGroup, entry);

            parentGroup.add(newEntry);
        }
    }
    
    private createEntry(parentGroup: PasswordGroup, entry: CsvEntry) {
        const newEntry = new PasswordEntry(parentGroup);
        newEntry.name = entry.title;
        newEntry.username = entry.username;
        newEntry.password = entry.password;
        newEntry.url = entry.url;
        return newEntry;
    }

    private ensureGroupsExist(groupNames: string[], root: PasswordGroup): PasswordGroup {
        let parent = root;

        for(const groupName of groupNames) {
            const group = parent.findGroupByName(groupName);
            
            if(group === null) {
                const newGroup = new PasswordGroup(groupName);
                parent.addGroup(newGroup);
                parent = newGroup;
            } else {
                parent = group;
            }
        }

        return parent;
    }
    
    private parseGroups(input: string): string[] {
        return input.split("/");
    }
}