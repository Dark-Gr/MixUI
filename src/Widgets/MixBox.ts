import MixElement, { type ElementOptions } from "./MixElement";

export type BoxOptions = {

} & ElementOptions;

export default class MixBox extends MixElement {
    constructor(options: BoxOptions) {
        super(options);
    }

    protected _render(): void {
        this.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    }
}