/// <reference path="abstract_pixel.ts" />

namespace Charjs {
    export abstract class AbstractObject extends AbstractPixel implements IObject {
        public _name = '';

        public _gameMaster: GameMaster = null;

        abstract chars: number[][][];
        abstract cchars: number[][][];
        abstract colors: string[];

        abstract onPushedUp(player: IPlayer): void;
        abstract onStepped(player: IPlayer): void;

        protected currentAction: HTMLCanvasElement = null;
        protected _rightActions: HTMLCanvasElement[] = [];
        protected _leftActions: HTMLCanvasElement[] = [];
        protected _verticalRightActions: HTMLCanvasElement[] = [];
        protected _verticalLeftActions: HTMLCanvasElement[] = [];

        protected size: ISize = { height: 0, width: 0, widthOffset: 0, heightOffset: 0 };
        protected entity: Entity = { ground: null, ceiling: null, right: null, left: null };

        protected _isActive = true;

        constructor(protected targetDom: HTMLElement, protected pixSize = 2, protected position: IPosition = { x: 0, y: 0 }, protected _direction = Direction.Right, private useLeft = true, private useVertical = true, public zIndex = 100, protected frameInterval = 45) {
            super();
        }

        protected uncompress() {
            if (this.cchars && this.cchars.length > 0) {
                this.chars = [];
                for (let cchar of this.cchars) {
                    this.chars.push(Util.Compression.RLD(cchar));
                }
            } else {
                // // for debbuging code
                // this.cchars = [];
                // for (let char of this.chars) {
                //     this.cchars.push(Util.Compression.RLE(char));
                // }
                // console.log(this._name + ":" + JSON.stringify(this.cchars));
            }
        }

        protected getTimer(func: Function, interval: number): number {
            if (this._gameMaster) {
                return this._gameMaster.addEvent(func);
            } else {
                return setInterval(func, interval);
            }
        }

        protected removeTimer(id: number): void {
            if (this._gameMaster) {
                this._gameMaster.removeEvent(id);
            } else {
                clearInterval(id);
            }
        }

        init(shadow: boolean = false): AbstractObject {
            this.uncompress();
            for (let charactor of this.chars) {
                this._rightActions.push(this.createCharacterAction(charactor, shadow));
                if (this.useLeft)
                    this._leftActions.push(this.createCharacterAction(charactor, shadow, true));
                if (this.useVertical) {
                    this._verticalRightActions.push(this.createCharacterAction(charactor, shadow, false, true));
                    if (this.useLeft)
                        this._verticalLeftActions.push(this.createCharacterAction(charactor, shadow, true, true));
                }
            }
            return this;
        }

        private createCharacterAction(charactorMap: number[][], shadow: boolean, isReverse: boolean = false, isVerticalRotation: boolean = false): HTMLCanvasElement {
            this.size.width = this.pixSize * charactorMap[0].length;
            this.size.height = this.pixSize * charactorMap.length;
            let element = AbstractObject.createCanvasElement(this.size.width, this.size.height, this.zIndex, shadow);
            AbstractCharacter.drawCharacter(element.getContext('2d'), charactorMap, this.colors, this.pixSize, isReverse, isVerticalRotation, shadow);
            return element;
        }

        protected static drawCharacter(ctx: CanvasRenderingContext2D, map: number[][], colors: string[], size: number, reverse: boolean, vertical: boolean, shadow: boolean): void {
            if (reverse)
                ctx.transform(-1, 0, 0, 1, map[0].length * size, 0);
            if (vertical)
                ctx.transform(1, 0, 0, -1, 0, map.length * size);

            if (shadow) {
                for (let y = 0; y < map.length; y++) {
                    for (let x = 0; x < map[y].length; x++) {
                        if (map[y][x] != 0) {
                            AbstractObject.drawPixel(ctx, x + (1 * (reverse ? -1 : 1)), y + (1 * (vertical ? -1 : 1)), size, '#000', 0.3);
                        }
                    }
                }
            }
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    if (map[y][x] != 0) {
                        AbstractObject.drawPixel(ctx, x, y, size, colors[map[y][x]]);
                    }
                }
            }
        }

        protected removeCharacter(target?: HTMLCanvasElement): void {
            if (target) {
                this.targetDom.removeChild(target);
            } else {
                if (this.currentAction != null) {
                    this.targetDom.removeChild(this.currentAction);
                    this.currentAction = null;
                }
            }
        }

        public draw(index: number = 0, position: IPosition = null, direction: Direction = Direction.Right, vertical: Vertical = Vertical.Up, removeCurrent = false, drawOffset = this.pixSize, clone = false): HTMLCanvasElement {
            if (removeCurrent && !clone) this.removeCharacter();
            position = position || this.position;
            let action = null;
            if (vertical == Vertical.Up) {
                action = direction == Direction.Right ? this._rightActions[index] : this._leftActions[index];
            } else {
                action = direction == Direction.Right ? this._verticalRightActions[index] : this._verticalLeftActions[index];
            }
            if (clone) {
                action = this.cloneCanvas(action);
            } else {
                this.currentAction = action;
            }

            action.style.left = position.x + 'px';
            action.style.bottom = (position.y - drawOffset) + 'px';
            action.style.zIndex = this.zIndex.toString();
            this.targetDom.appendChild(action);

            return action;
        }

        private cloneCanvas(oldCanvas: HTMLCanvasElement): HTMLCanvasElement {
            let canvas = AbstractPixel.createCanvasElement(oldCanvas.width, oldCanvas.height, this.zIndex + 1);
            let ctx = canvas.getContext("2d");
            ctx.drawImage(oldCanvas, 0, 0);
            return canvas;
        }

        public refresh() {
            this.currentAction.style.left = this.position.x + 'px';
            this.currentAction.style.bottom = this.position.y + 'px';
        }

        public destroy(): void {
            this.removeCharacter();
        }

        public getPosition(): IPosition {
            return this.position;
        }

        public setPosition(pos: IPosition): void {
            this.position = pos;
        }

        public getCharSize(): ISize {
            return this.size;
        }

        public getCurrntElement(): HTMLCanvasElement {
            return this.currentAction;
        }

        public getDirection(): Direction {
            return this._direction;
        }

        public isActive() {
            return this._isActive;
        }
    }

}