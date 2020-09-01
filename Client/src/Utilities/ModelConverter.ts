import * as Api from "../Services/ApiService"
import * as Model from "../Model/Model";

export function convertApiGroupToModel(group: Api.Group) : Model.PasswordGroup {
    const modelGroup = new Model.PasswordGroup(group.name);
    modelGroup.id = group.id;
    modelGroup.isRecycleBin = group.isRecycleBin;
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
    modelEntry.history = entry.history?.map(convertApiHistoryToModel) ?? [];

    if (entry.history) {
        for (let i=modelEntry.history.length-2; i>=0; i--) {
            modelEntry.history[i].updateChangeSummary(modelEntry.history[i+1])
        }
    }

    return modelEntry;
}

export function convertApiHistoryToModel(history: Api.History) : Model.HistoryEntry {
    const modelHistory = new Model.HistoryEntry();
    modelHistory.date = history.date;
    modelHistory.name = history.name;
    modelHistory.url = history.url;
    modelHistory.username = history.username;
    modelHistory.password = history.password;
    console.log(typeof(modelHistory.date));
    return modelHistory;
}

export function convertToApiModelGroup(group: Model.PasswordGroup) : Api.Group {
    const apiGroup = new Api.Group();
    apiGroup.id = group.id;
    apiGroup.name = group.name;
    apiGroup.isRecycleBin = group.isRecycleBin;
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
    apiEntry.history = entry.history.map(convertFromApiModelEntry);

    return apiEntry;
}

export function convertFromApiModelEntry(history: Model.HistoryEntry) : Api.History {
    const apiHistory = new Api.History();
    apiHistory.date = history.date;
    apiHistory.name = history.name;
    apiHistory.url = history.url;
    apiHistory.username = history.username;
    apiHistory.password = history.password;
    
    return apiHistory;
}