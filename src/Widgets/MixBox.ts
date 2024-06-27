import { hexToAnsi } from "../Utils/ColorConverter";
import MixElement, { type ElementOptions } from "./MixElement";

export type BoxOptions = {
    label?: string;

    style?: {
        border?: {
            labelBreakRounded?: boolean;
            rounded?: boolean;
            foregroundColor?: string | "default";
            backgroundColor?: string | "default";
        },
        backgroundColor?: string | "default";
    }
} & ElementOptions;

export default class MixBox extends MixElement {
    constructor(options: BoxOptions) {
        super(options);
    }

    protected _render(): void {
        const opts = this.options as BoxOptions;

        const borderForeground = opts.style?.border?.foregroundColor || "default";
        const borderBackground = opts.style?.border?.backgroundColor || "default";
        const roundedCorners = opts.style?.border?.rounded || false;

        const boxBackground = opts.style?.backgroundColor || "default";
        const labelBreakRounded = opts.style?.border?.labelBreakRounded || false;

        const label = opts.label;

        const borderForegroundAnsi = hexToAnsi(borderForeground);
        const borderBackgroundAnsi = hexToAnsi(borderBackground);

        this.outlineRect(this.getX(), this.getY(), this.getWidth(), this.getHeight(), borderForeground, borderBackground, roundedCorners);
        if(boxBackground !== "default") this.fillRect(this.getX() + 1, this.getY() + 1, this.getWidth() - 1, this.getHeight() - 1, boxBackground);

        if(label) {
            this.writeText(this.getX() + 3, this.getY(), label);
            this._renderingBuffer.insertSingle({ character: labelBreakRounded ? "╮" : "┐", foregroundColor: borderForegroundAnsi, backgroundColor: borderBackgroundAnsi }, this.getX() + 2, this.getY());
            this._renderingBuffer.insertSingle({ character: labelBreakRounded ? "╭" : "┌", foregroundColor: borderForegroundAnsi, backgroundColor: borderBackgroundAnsi }, this.getX() + label.length + 3, this.getY());
        }
    }

    protected writeText(x: number, y: number, text: string) {
        for(let i = 0; i < text.length; i++) {
            const character = text[i];
            this._renderingBuffer.insertSingle({ character }, x + i, y);
        }
    }
}