import * as Model from "../Model/Model";

class LineReader {
    private _line: string;
    private _index = 0;

    constructor(line: string) {
        this._line = line;
    }

    public atEnd(): boolean {
        return this._index >= this._line.length;
    }

    public read(): string | null {
        if (this.atEnd()) 
            return null;

        const chr = this._line.charAt(this._index);
        this._index++;
        return chr;
    }

    public peek(): string | null {
        if (this.atEnd()) 
            return null;

        return this._line.charAt(this._index);
    }
}

export class CsvParser {
    public parse(input: string): string[][] {
        const reader = new LineReader(input);
        const lines = new Array<string[]>();

        while(!reader.atEnd()) {
            const chr = reader.peek();

            if(chr === "\"") {
                lines.push(this.parseLine(reader));
            } else if(chr === "\n" || chr === "\r" || chr === " ") {
                reader.read();
            } else {
                throw new Error(`Unexpected character ${chr}`);
            }
        }

        return lines;
    }

    private parseLine(reader: LineReader): string[] {
        const parts = new Array<string>();

        while(!reader.atEnd()) {
            const chr = reader.peek();

            if(chr === "\"") {
                parts.push(this.readString(reader));
            } else if(chr === "," || chr === " ") {
                reader.read();
            } else if(chr === "\r" || chr === "\n") {
                break;
            } else {
                throw new Error(`Unexpected character ${chr}`);
            }
        }

        return parts;
    }

    private readString(reader: LineReader): string {
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
}