import type { Symbol } from "../ExpressionParser";
import evaluateExpression from "../ExpressionParser";
import type { Character } from "../RenderingBuffer";
import MixNode, { type NodeOptions } from "./MixNode";

export type ElementOptions = {
    top: string | number;
    left: string | number;
    width: string | number;
    height: string | number;

    foregroundColor?: string;
    backgroundColor?: string;
} & NodeOptions;

export default abstract class MixElement extends MixNode {
    private absX: number = 0;
    private absY: number = 0;
    private absWidth: number = 0;
    private absHeight: number = 0;

    constructor(options: ElementOptions = { top: 0, left: 0, width: 10, height: 10 }) {
        super(options);
    }

    public override render(): void {
        this.updateProperties();
        this._renderingBuffer.clear();
        super.render();

        this.parent?.mergeBuffer(this._renderingBuffer);
    }

    private updateProperties() {
        const { top, left, width, height } = this.options as ElementOptions;
        
        const parentWidth = this.parent?.getWidth() ?? 0;
        const parentHeight = this.parent?.getHeight() ?? 0;
        const parentX = this.parent?.getX() ?? 0;
        const parentY = this.parent?.getY() ?? 0;
        
        const symbols: Symbol[] = [
            { name: "parent-top", value: parentY },
            { name: "parent-left", value: parentX },
            { name: "parent-width", value: parentWidth },
            { name: "parent-height", value: parentHeight },
        ];

        this.absX = parentX + (typeof left === "string" ? evaluateExpression(left, symbols) : left);
        this.absY = parentY + (typeof top === "string" ? evaluateExpression(top, symbols) : top);
        this.absWidth = typeof width === "string" ? evaluateExpression(width, symbols) : width;
        this.absHeight = typeof height === "string" ? evaluateExpression(height, symbols) : height;
    }

    protected drawLine(x1: number, y1: number, x2: number, y2: number, character: Character) {
        let xStart = Math.min(x1, x2);
        let xEnd = Math.max(x1, x2);
        let yStart = Math.min(y1, y2);
        let yEnd = Math.max(y1, y2);

        for(let x = xStart; x <= xEnd; x++) {
            for(let y = yStart; y <= yEnd; y++)
                this._renderingBuffer.insert(character, x, y);
        }

    }

    protected fillRect(x: number, y: number, width: number, height: number) {
        this.drawLine(x, y, x + width, y, { character: "─" });
        this.drawLine(x, y, x, y + height, { character: "│" });
        this.drawLine(x + width, y, x + width, y + height, { character: "│", });
        this.drawLine(x, y + height, x + width, y + height, { character: "─" });

        this._renderingBuffer.insert({ character: "┌" }, x, y);
        this._renderingBuffer.insert({ character: "┐" }, x + width, y);
        this._renderingBuffer.insert({ character: "└" }, x, y + height);
        this._renderingBuffer.insert({ character: "┘" }, x + width, y + height);
    }

    public getWidth(): number {
        return this.absWidth;
    }

    public getHeight(): number {
        return this.absHeight;
    }

    public getX(): number {
        return this.absX;
    }

    public getY(): number {
        return this.absY;
    }
}