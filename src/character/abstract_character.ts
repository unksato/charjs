namespace Character {
    export class Position {
        public x: number = 0;
        public y: number = 0;
    }

    export enum Direction {
        right,
        left
    }

    export enum Vertical {
        up,
        down
    }

    export interface ICharacter {
        _name: string;
        init(): void;
        start(): void;
        stop(): void;
        destroy(): void;
        getPosition(): Position;
        setPosition(position: Position): void;
        getCharSize(): { height: number, width: number };
    }

    export interface IEnemy extends ICharacter{
        onStepped(): void;
        onKicked(direction: number, kickPower: number): void;
        isKilled(): boolean;
        isStepped(): boolean; 
    }

    export abstract class AbstractCharacter implements ICharacter{
        abstract chars: number[][][];
        abstract colors: string[];
        abstract onAction(): void;        
        abstract registerActionCommand(): void;
        abstract isEnemy: boolean;
        abstract useVertical: boolean;

        public _name = '';

        protected cssTextTemplate = `z-index: ${this.zIndex}; position: absolute; bottom: 0;`;
        protected currentAction: HTMLCanvasElement = null;
        protected _rightActions : HTMLCanvasElement[] = [];
        protected _leftActions : HTMLCanvasElement[]  = [];
        protected _verticalRightActions : HTMLCanvasElement[]  = [];
        protected _verticalLeftActions : HTMLCanvasElement[]  = [];

        protected charWidth: number = null;
        protected charHeight: number = null;

        public _gameMaster: GameMaster = null;

        private _isStarting = false;
        private _frameTimer: number = null;
        protected _gravity = 2;

        constructor(protected targetDom,protected pixSize = 2, protected position: Position = {x: 0, y:0}, protected _direction = Direction.right, protected zIndex = 2147483645, protected frameInterval = 45) {
        }

        public init(): void{
             for (let charactor of this.chars) {
                this._rightActions.push(this.createCharacterAction(charactor));
                this._leftActions.push(this.createCharacterAction(charactor, true));
                if (this.useVertical) {
                    this._verticalRightActions.push(this.createCharacterAction(charactor, false, true));
                    this._verticalLeftActions.push(this.createCharacterAction(charactor, true, true));
                }
             }           
        }

        private createCharacterAction(charactorMap: number[][], isReverse:boolean = false, isVerticalRotation:boolean = false) : HTMLCanvasElement{
            let element = document.createElement("canvas");
            let ctx = element.getContext("2d");
            this.charWidth = this.pixSize * charactorMap[0].length + 1;
            this.charHeight = this.pixSize * charactorMap.length;

            element.setAttribute("width", this.charWidth.toString());
            element.setAttribute("height", this.charHeight.toString());
            element.style.cssText = this.cssTextTemplate;
            AbstractCharacter.drawCharacter(ctx, charactorMap, this.colors, this.pixSize, isReverse, isVerticalRotation);
            return element;
        }    

        private static drawCharacter(ctx:CanvasRenderingContext2D, map:number[][], colors:string[], size:number, reverse: boolean, vertical: boolean) : void {
            if (reverse)
                ctx.transform(-1, 0, 0, 1, map[0].length * size, 0);
            if (vertical)
                ctx.transform(1, 0, 0, -1, 0, map.length * size);
            for (let y = 0; y < map.length; y++){
                for (let x = 0; x < map[y].length; x++){
                    if (map[y][x] != 0) {
                        ctx.beginPath();
                        ctx.rect(x * size, y * size, size, size);
                        ctx.fillStyle = colors[map[y][x]];
                        ctx.fill();
                    }
                }
            }
        }

        protected removeCharacter(): void {
            if (this.currentAction != null) {
                this.targetDom.removeChild(this.currentAction);
                this.currentAction = null;
            }
        }

        public draw(index: number = 0, position: Position = null, direction: Direction = Direction.right, vertical: Vertical = Vertical.up, removeCurrent = false): void {
            if (removeCurrent) this.removeCharacter();
            position = position || this.position;
            if (vertical == Vertical.up) {
                this.currentAction = direction == Direction.right ? this._rightActions[index] : this._leftActions[index]; 
            } else {
                this.currentAction = direction == Direction.right ? this._verticalRightActions[index] : this._verticalLeftActions[index];                 
            }
            this.currentAction.style.left = position.x + 'px';
            this.currentAction.style.bottom = this.position.y + 'px';
            this.targetDom.appendChild(this.currentAction);
        }

        public registerCommand(): void {
            document.addEventListener('keypress', this.defaultCommand);
            this.registerActionCommand();
        }

        defaultCommand = (e:KeyboardEvent) => {
            if (e.keyCode == 32) {
                if (this._isStarting) {
                    this.stop();
                } else {
                    this.start();
                }
            }
        }

        public start(): void {
            this.registerCommand();
            this._isStarting = true;
            this._frameTimer = setInterval(() => { this.onAction() }, this.frameInterval);
        }

        public stop(): void {
            if (this._frameTimer) {
                clearInterval(this._frameTimer);
                this._frameTimer = null;
            }
            this._isStarting = false;
        }

        public destroy(): void {
            this.stop();
            this.removeCharacter();
            if(this._gameMaster && this.isEnemy){
                this._gameMaster.deleteEnemy(<any>this);
            }
            document.removeEventListener('keypress', this.defaultCommand);
        }

        public getPosition(): Position {
            return this.position;
        }

        public setPosition(pos: Position): void {
            this.position = pos;
        }

        public getCharSize(): { height: number, width: number } {
            return { height: this.charHeight, width: this.charWidth };
        }

        protected updateDirection(): boolean{
            let currentDirection = this._direction;

            if (this.position.x > this.targetDom.clientWidth - this.charWidth - (/*Magic offset*/ this.pixSize * 2) && this._direction == Direction.right) {
                this._direction = Direction.left;
            }
            if (this.position.x < 0 && this._direction == Direction.left) {
                this._direction = Direction.right;
            }

            return currentDirection != this._direction;
        }

        public checkMobile(): boolean {
            if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
                return true;
            } else {
                return false;
            }
        }

    }
}