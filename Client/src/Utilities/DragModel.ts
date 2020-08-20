export enum DragSource {
    Group,
    Entry
}

export interface DragModel {
    type: DragSource;
    id: string
}

export function createDragModel(type: DragSource, id: string): DragModel {
    return {type, id};
}

export function serializeDragModel(model: DragModel): string {
    return JSON.stringify(model);
}

export function parseDragModel(input: string): DragModel {
    return JSON.parse(input);
}