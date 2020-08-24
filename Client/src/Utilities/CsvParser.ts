class TextReader {
    private _string: string;
    private _index = 0;
    private _column = 0;
    private _row = 0;

    constructor(line: string) {
        this._string = line;
    }

    public atEnd(): boolean {
        return this._index >= this._string.length;
    }

    public read(): string | null {
        if (this.atEnd()) 
            return null;

        const chr = this._string.charAt(this._index);
        if(chr === "\n") {
            this._row++;
            this._column = 0;
        } else {
            this._column++;
        }

        this._index++;
        return chr;
    }

    public peek(): string | null {
        if (this.atEnd()) 
            return null;

        return this._string.charAt(this._index);
    }

    public get row(): number {
        return this._row;
    }

    public get column(): number {
        return this._column;
    }
}

export interface CsvEntry {
    name: string;
    username: string;
    url: string;
    password: string;
}

export class CsvParser {
    public parse(input: string): CsvEntry[] {
        const data = this.parseRows(input);
        const headers = this.prepareColumnMapping(data[0]);
        this.throwIfColumnsMissing(headers);
        const items: CsvEntry[] = [];

        for(let i=1; i<data.length; i++) {
            const line = data[i];

            items.push({
                name: this.lookupColumn(line, "name", headers),
                username: this.lookupColumn(line, "username", headers),
                url: this.lookupColumn(line, "url", headers),
                password: this.lookupColumn(line, "password", headers)
            });
        }

        return items;
    }

    private lookupColumn(line: string[], columnName: string, columnMapping: Map<string, number> ) {
        const columnIndex = columnMapping.get(columnName);

        if(columnIndex !== undefined)
            return line[columnIndex];
        else
            return "";
    }

    private prepareColumnMapping(headerRow: string[]): Map<string, number> {
        const mapping = new Map<string, number>();
        for (let i=0; i<headerRow.length; i++) {
            mapping.set(headerRow[i].toLowerCase(), i);
        }
        return mapping;
    }

    private throwIfColumnsMissing(columns: Map<string, number>) {
        this.throwIfColumnMissing("name", columns);
        this.throwIfColumnMissing("username", columns);
        this.throwIfColumnMissing("url", columns);
        this.throwIfColumnMissing("password", columns);
    }

    private throwIfColumnMissing(name: string, columns: Map<string, number>) {
        if (columns.get(name) === undefined)
            throw new Error(`Missing column '${name}'`);
    }

    private parseRows(input: string): string[][] {
        const reader = new TextReader(input);
        const lines = new Array<string[]>();

        while(!reader.atEnd()) {
            const chr = reader.peek();
            if(chr === null)
                break;
            
            if(chr === "\"") {
                lines.push(this.parseLine(reader));
            } else if(this.isNewline(chr) || this.isWhiteSpace(chr)) {
                reader.read();
            } else {
                throw new Error(`Unexpected character '${chr}' (row: ${reader.row}, column: ${reader.column})`);
            }
        }

        return lines;
    }

    private parseLine(reader: TextReader): string[] {
        const parts = new Array<string>();

        while(!reader.atEnd()) {
            const chr = reader.peek();
            if(chr === null)
                break;

            if(chr === "\"") {
                parts.push(this.readString(reader));
            } else if(chr === "," || this.isWhiteSpace(chr)) {
                reader.read();
            } else if(this.isNewline(chr)) {
                break;
            } else {
                throw new Error(`Unexpected character '${chr}' (row: ${reader.row}, column: ${reader.column})`);
            }
        }

        return parts;
    }

    private readString(reader: TextReader): string {
        let str = "";
        reader.read();

        while(true) {
            const chr = reader.read();

            if(chr === "\"") {
                if(reader.peek() === "\"") {
                    str = str + "\"";
                    reader.read();
                } else {
                    break;
                }
            } else {
                str = str + chr;
            }
        }

        return str;
    }

    private isWhiteSpace(input: string): boolean {
        return input === " " || input === "\t";
    }

    private isNewline(input: string): boolean {
        return input === "\r" || input === "\n";
    }
}