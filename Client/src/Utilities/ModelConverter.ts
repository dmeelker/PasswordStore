import * as Api from "../Services/ApiService"
import * as Model from "../Model/Model";

export function convertApiGroupToModel(group: Api.Group) : Model.PasswordGroup {
    const modelGroup = new Model.PasswordGroup(group.name);
    modelGroup.id = group.id;
    modelGroup.entries = group.entries.map((entry) => convertApiEntryToModel(entry, modelGroup));
    modelGroup.groups = group.groups.map(convertApiGroupToModel);
    return modelGroup;
}

export function convertApiEntryToModel(entry: Api.Entry, parentGroup: Model.PasswordGroup) : Model.PasswordEntry {
    const modelEntry = new Model.PasswordEntry(parentGroup);
    modelEntry.id = entry.id;
    modelEntry.name = entry.name;
    modelEntry.url = entry.url;
    modelEntry.username = entry.username;
    modelEntry.password = entry.password;

    return modelEntry;
}

export function convertToApiModelGroup(group: Model.PasswordGroup) : Api.Group {
    const apiGroup = new Api.Group();
    apiGroup.id = group.id;
    apiGroup.name = group.name;
    apiGroup.entries = group.entries.map(convertToApiModelEntry);
    apiGroup.groups = group.groups.map(convertToApiModelGroup);

    return apiGroup;
}

export function convertToApiModelEntry(entry: Model.PasswordEntry) : Api.Entry {
    const apiEntry = new Api.Entry();
    apiEntry.id = entry.id;
    apiEntry.name = entry.name;
    apiEntry.url = entry.url;
    apiEntry.username = entry.username;
    apiEntry.password = entry.password;

    return apiEntry;
}