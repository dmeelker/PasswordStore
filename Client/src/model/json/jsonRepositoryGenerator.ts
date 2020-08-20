import * as Model from "../passwordRepository";
import * as Api from "../../api";

export default function generateJson(root: Model.PasswordGroup) : Api.Document {
    let document = new Api.Document();
    document.Format = "1.0";

    for(let group of root.childGroups) {
        document.Entries.push(convertGroup(group));
    }

    for(let entry of root.entries) {
        document.Entries.push(convertEntry(entry));
    }

    return document;
}

function convertGroup(group: Model.PasswordGroup) : Api.Entry {
    let entry = new Api.Entry();
    entry.Type = "Group";
    entry.Name = group.name;

    for(let childGroup of group.childGroups) {
        entry.Children.push(convertGroup(childGroup));
    }

    for(let childEntry of group.entries) {
        entry.Children.push(convertEntry(childEntry));
    }

    return entry;
}

function convertEntry(entry: Model.PasswordEntry) : Api.Entry {
    let apiEntry = new Api.Entry();
    apiEntry.Name = entry.name;
    apiEntry.Type = "Password";
    apiEntry.Password = entry.password;
    return apiEntry;
}