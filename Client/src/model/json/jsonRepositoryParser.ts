import * as Model from "../passwordRepository";

export default function parse(jsonDocument: any) : Model.PasswordRepository {
    let entries = jsonDocument.Entries;
    let rootGroup = new Model.PasswordGroup("Root");

    parseEntries(entries, rootGroup);

    return new Model.PasswordRepository(rootGroup);
}

function parseGroup(entry: any) : Model.PasswordGroup {
    let newGroup = new Model.PasswordGroup(entry.Name);

    if (entry.Children) {
        parseEntries(entry.Children, newGroup);
    }

    return newGroup;
}

function parsePasswordEntry(entry: any) : Model.PasswordEntry {
    return new Model.PasswordEntry(entry.Name, entry.Name, entry.Password);
}

function parseEntries(entries: any, parent: Model.PasswordGroup) {
    for (let key in entries) {
        let entry = entries[key];
        if (entry.Type == "Group") {
            parent.childGroups.push(parseGroup(entry));
        } else if (entry.Type == "Password") {
            parent.entries.push(parsePasswordEntry(entry));
        }
    }
}