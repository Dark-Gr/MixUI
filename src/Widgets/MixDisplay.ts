import * as readline from "readline";
import { clearScreenAndResetCursor, hideBlinkCursor, showBlinkCursor, switchToAlternateTerminalBuffer, switchToMainTerminalBuffer } from "../TerminalController";
import MixNode from "./MixNode";

type KeyboardEvenHandler = {
    patterns: string[],
    callback: (key: string) => void;
}

export default class MixDisplay extends MixNode {
    protected _width: number = 0;
    protected _height: number = 0;
    private onAlternateTerminalBuffer = false;

    private keyboardHandlers: KeyboardEvenHandler[];

    constructor() {
        super();

        this.keyboardHandlers = [];
        
        // Setup stdin to receive keypresses
        readline.emitKeypressEvents(process.stdin);
        if(process.stdin.isTTY)
            process.stdin.setRawMode(true);
        
        process.stdout.on("resize", () => this.updateTerminalSize());
        
        process.on("exit", () => {
            showBlinkCursor();
            switchToMainTerminalBuffer();
        });
        
        process.stdin.on("keypress", (str, key: { sequence: string, name: string, ctrl: boolean, meta: boolean, shift: boolean }) => {
            this.keyboardHandlers.forEach(handler => {
                if(handler.patterns.includes(key.sequence))
                    handler.callback(key.sequence);
            });
        })
        
        this.display = this;
        this.updateTerminalSize();
    }

    public onKeyPress(patterns: string[], callback: (key: string) => void) {
        const handler: KeyboardEvenHandler = { patterns, callback };
        this.keyboardHandlers.push(handler);
    }

    public override render(): void {
        super.render();

        if(!this.parent) { // Only render if we are the root node
            const renderString = this._renderingBuffer.toANSIString();
            clearScreenAndResetCursor();
            hideBlinkCursor();

            process.stdout.write(renderString);
        }
    }

    private updateTerminalSize() {
        this._width = process.stdout.columns;
        this._height = process.stdout.rows;

        this._renderingBuffer.resize(this._width, this._height);
        this.emit("buffer-resize", this._width, this._height);
        
        this.render();
    }

    protected _render(): void {
        // Only switch if we are the root node
        if(!this.parent && !this.onAlternateTerminalBuffer) {
            switchToAlternateTerminalBuffer();
            this.onAlternateTerminalBuffer = true;
        }
    }

    public relativePosition(x: number, y: number): { x: number; y: number; } {
        return { x, y };
    }

    public getWidth(): number {
        return this._width;
    }

    public getHeight(): number {
        return this._height;
    }

    public getX(): number {
        return 0;
    }

    public getY(): number {
        return 0;
    }
}