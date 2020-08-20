import * as Model from "../passwordRepository";
import * as Api from "../../api"

export default function parse(jsonDocument: Api.Document) : Model.PasswordGroup {
    let entries = jsonDocument.Entries;
    let rootGroup = new Model.PasswordGroup("Root");

    parseEntries(entries, rootGroup);

    return rootGroup;
}

function parseGroup(entry: Api.Entry) : Model.PasswordGroup {
    let newGroup = new Model.PasswordGroup(entry.Name);

    if (entry.Children) {
        parseEntries(entry.Children, newGroup);
    }

    return newGroup;
}

function parsePasswordEntry(entry: Api.Entry) : Model.PasswordEntry {
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