import RenderingBuffer from "../RenderingBuffer";
import EventEmitter from "node:events";
import MixDisplay from "./MixDisplay";

export type NodeOptions = {
    zIndex?: number;
}

export default abstract class MixNode extends EventEmitter {
    public _parent: MixNode | null;

    private _display: MixDisplay | null = null;
    private _options: NodeOptions;
    
    protected _children: MixNode[];
    protected _renderingBuffer: RenderingBuffer;
    
    constructor(options: NodeOptions = { zIndex: 0 }) {
        super();

        this._options = options;
        this._parent = null;
        this._children = [];
        this._renderingBuffer = new RenderingBuffer(0, 0);
    }
    
    protected abstract _render(): void;

    public abstract getWidth(): number;
    public abstract getHeight(): number;
    public abstract getX(): number;
    public abstract getY(): number;

    public render(): void {
        this._render();
        this._renderChildren();
    }
    
    private _renderChildren(): void {
        this._children.sort((a, b) => (a.options.zIndex || 0) - (b.options.zIndex || 0)).forEach(child => child.render());
    }

    public get options(): NodeOptions {
        return this._options;
    }

    public get parent(): MixNode | null {
        return this._parent;
    }

    public get children(): MixNode[] {
        return this._children;
    }

    public get renderingBuffer(): RenderingBuffer {
        return this._renderingBuffer.asReadOnly();
    }

    public get display() {
        return this._display;
    }

    public set display(newDisplay: MixDisplay | null) {
        this._display = newDisplay;

        if (newDisplay) {
            this._renderingBuffer.resize(newDisplay.getWidth(), newDisplay.getHeight());
            
            if((newDisplay as MixNode) !== this) 
                newDisplay.on("buffer-resize", (width, height) => this._renderingBuffer.resize(width, height));

            this.children.forEach(child => child.display = newDisplay);
        }
    }

    public mergeBuffer(buffer: RenderingBuffer) {
        this._renderingBuffer.insertBuffer(buffer);
    }

    public append(node: MixNode) {
        this._children.push(node);
        node._parent = this;
        node.display = this._display;
    }

    public prepend(node: MixNode) {
        this._children.unshift(node);
        node._parent = this;
        node.display = this._display;
    }

    public insert(node: MixNode, index: number) {
        this._children.splice(index, 0, node);
        node._parent = this;
        node.display = this._display;
    }

    public insertBefore(node: MixNode, reference: MixNode) {
        const index = this._children.indexOf(reference);
        if (index !== -1) {
            this._children.splice(index, 0, node);
            node._parent = this;
            node.display = this._display;
        }
    }

    public insertAfter(node: MixNode, reference: MixNode) {
        const index = this._children.indexOf(reference);
        if (index !== -1) {
            this._children.splice(index + 1, 0, node);
            node._parent = this;
            node.display = this._display;
        }
    }

    public remove(node: MixNode) {
        const index = this._children.indexOf(node);
        if (index !== -1) {
            this._children.splice(index, 1);
            node._parent = null;
            node.display = null;
        }
    }

    public noChildren() {
        return this._children.length = 0;
    }
}