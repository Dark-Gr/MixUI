import { ESC } from "./TerminalController";

export type Character = {
    character: string;
    foregroundColor?: "default" | number;
    backgroundColor?: "default" | number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
}

export type CellInfo = {
    character: Character | null;

    x: number;
    y: number;
}

export default class RenderingBuffer {
    private buffer: (CellInfo | null)[];
    private width: number;
    private height: number;
    private _isReadonly: boolean;

    constructor(width: number, height: number, data: (CellInfo | null)[] = [], isReadonly: boolean = false) {
        this.buffer = new Array(width * height);
        this.width = width;
        this.height = height;
        this._isReadonly = isReadonly;

        this.buffer.push(...data);
    }

    public insertSingle(character: Character, x: number, y: number) {
        if(this.isReadonly())
            throw new Error("Cannot insert into a readonly buffer");

        if(x < 0 || x >= this.width || y < 0 || y >= this.height) 
            return;

        this.buffer[y * this.width + x] = { character, x, y };
    }
    
    public insertBuffer(other: RenderingBuffer) {
        if (this.isReadonly())
            throw new Error("Cannot insert into a readonly buffer");

        for (let i = 0; i < this.buffer.length; i++) {
            const x = i % this.width;
            const y = (i - x) / this.width;

            const otherElement = other.query(x, y) || null;
            if (otherElement !== null)
                this.buffer[i] = otherElement;
        }
    }

    public query(x: number, y: number): CellInfo | null | undefined {
        if(x < 0 || x >= this.width || y < 0 || y >= this.height)
            return undefined;

        return this.buffer[y * this.width + x] || null;
    }

    public toANSIString() {
        let result = "";
        let previousCharacter: Character | null = null;
        let hadStyle = false;

        let previousX = 0;
        let previousY = 0;

        const dirtyCells = this.buffer.filter(cell => cell !== null);

        for(let i = 0; i < dirtyCells.length; i++) {
            const currentCell = dirtyCells[i]!;
            const currentCharacter = currentCell.character || null;

            const x = currentCell.x;
            const y = currentCell.y;

            // We only move the cursor if the distance between the two cells is greater than 8, as anything smaller than this makes using spaces more efficient
            // The above statement is not true when the y coordinate changes as that causes the cursor to move to the next line
            if(x - previousX > 8 || y !== previousY) result += `${ESC}[${y + 1};${x + 1}H`;
            else if(y === previousY && x - previousX <= 8) result += " ".repeat(x - previousX - 1);

            previousX = x;
            previousY = y;

            if(!currentCharacter) result += " ";
            else {
                let style = "";

                if(this.areCharactersSameStyle(previousCharacter, currentCharacter)) {
                    result += currentCharacter.character;
                    continue;
                } else if(hadStyle) {
                    style = `${ESC}[0m`;
                    hadStyle = false;
                }

                if(currentCharacter.foregroundColor && currentCharacter.foregroundColor !== "default") style += `${ESC}[38;5;${currentCharacter.foregroundColor}m`;
                if(currentCharacter.backgroundColor && currentCharacter.backgroundColor !== "default") style += `${ESC}[48;5;${currentCharacter.backgroundColor}m`;
                if(currentCharacter.bold) style += `${ESC}[1m`;
                if(currentCharacter.italic) style += `${ESC}[3m`;
                if(currentCharacter.underline) style += `${ESC}[4m`;
                if(currentCharacter.strikethrough) style += `${ESC}[9m`;

                result += `${style}${currentCharacter.character}`;
                previousCharacter = currentCharacter;
                hadStyle = true;
            }
        }

        return result;
    }

    private areCharactersSameStyle(a: Character | null, b: Character | null) {
        if(a === null && b === null) return true;
        if(a === null || b === null) return false;

        return a.foregroundColor == b.foregroundColor &&
            a.backgroundColor == b.backgroundColor &&
            a.bold == b.bold &&
            a.italic == b.italic &&
            a.underline == b.underline &&
            a.strikethrough == b.strikethrough;
    }

    public resize(width: number, height: number) {
        if(this.isReadonly())
            throw new Error("Cannot resize a readonly buffer");

        this.width = width;
        this.height = height;

        this.clear();
    }

    public clear() {
        this.buffer.length = 0;
        this.buffer.length = this.width * this.height;
    }

    public asReadOnly() {
        return new RenderingBuffer(this.width, this.height, this.buffer, true);
    }

    public isReadonly(): boolean {
        return this._isReadonly;
    }
}