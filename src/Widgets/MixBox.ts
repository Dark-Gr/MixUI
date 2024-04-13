import MixElement, { type ElementOptions } from "./MixElement";

export type BoxOptions = {
    
} & ElementOptions;

export default class MixBox extends MixElement {
    constructor(options: BoxOptions) {
        super(options);
    }

    protected _render(): void {
        const opts = this.options as BoxOptions;

        const borderForeground = opts.style?.border?.foregroundColor || "white";
        const borderBackground = opts.style?.border?.backgroundColor || "white";

        const boxBackground = opts.style?.backgroundColor || "white";

        this.outlineRect(this.getX(), this.getY(), this.getWidth(), this.getHeight(), borderForeground, borderBackground);
        if(boxBackground !== "white") this.fillRect(this.getX() + 1, this.getY() + 1, this.getWidth() - 1, this.getHeight() - 1, boxBackground);
    }
}