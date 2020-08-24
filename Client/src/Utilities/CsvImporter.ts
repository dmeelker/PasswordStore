import { PasswordGroup, PasswordEntry } from "../Model/Model";
import { CsvParser } from "./CsvParser";

export class CsvImporter {
    public import(csv: string, root: PasswordGroup) {
        const csvData = new CsvParser().parse(csv);

        for(const entry of csvData) {
            const groupNames = this.parseGroups(entry.group);
            console.log(groupNames);
            const parentGroup = this.ensureGroupsExist(groupNames, root);

            const newEntry = new PasswordEntry(parentGroup);
            newEntry.name = entry.name;
            newEntry.username = entry.username;
            newEntry.password = entry.password;
            newEntry.url = entry.url;

            parentGroup.add(newEntry);
        }
    }
    
    private ensureGroupsExist(groupNames: string[], root: PasswordGroup): PasswordGroup {
        let parent = root;

        for(const groupName of groupNames) {
            const group = parent.findGroupByName(groupName);
            console.log(group);
            
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