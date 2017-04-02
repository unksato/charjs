namespace Charjs {
    export enum Direction {
        right,
        left
    }

    export enum Vertical {
        up,
        down
    }

    export class Position {
        public x: number = 0;
        public y: number = 0;
    }

    export class Size {
        public width: number = 0;
        public height: number = 0;
        public widthOffset: number = 0;
        public heightOffset: number = 0;
    }

    export class Environment {
        public ground: number = null;
        public ceiling: number = null;
        public right: number = null;
        public left: number = null;
    }

    export interface IObject {
        _name: string;
        zIndex: number;
        init(): void;
        destroy(): void;
        getPosition(): Position;
        setPosition(position: Position): void;
        getCharSize(): Size;   
        getCurrntElement(): HTMLCanvasElement;     
    }

    export interface ICharacter extends IObject{
        start(): void;
        stop(): void;
        onAction(): void;
    }

    export interface IPlayer extends ICharacter{
        onGool(callback?: Function): void;
    }

    export interface IEnemy extends ICharacter{
        onStepped(): void;
        onGrabed(): void;
        onKicked(direction: number, kickPower: number): void;
        isKilled(): boolean;
        isStepped(): boolean; 
        drawAction(): void;
    }

    export abstract class AbstractObject implements IObject {
        public _name = '';
        abstract chars: number[][][];
        abstract colors: string[];
        protected cssTextTemplate = `z-index: ${this.zIndex}; position: absolute; bottom: 0;`;

        protected currentAction: HTMLCanvasElement = null;
        protected _rightActions : HTMLCanvasElement[] = [];
        protected _leftActions : HTMLCanvasElement[]  = [];
        protected _verticalRightActions : HTMLCanvasElement[]  = [];
        protected _verticalLeftActions : HTMLCanvasElement[]  = [];

        protected size : Size = {height:0, width:0, widthOffset:0, heightOffset:0};
        protected env: Environment = {ground:null, ceiling:null, right: null, left:null};

        constructor(protected targetDom,protected pixSize = 2, protected position: Position = {x: 0, y:0}, protected _direction = Direction.right, private useLeft = true, private  useVertical = true, public zIndex = 2147483640, protected frameInterval = 45) {
        }

        init(): void{
            for (let charactor of this.chars) {
                this._rightActions.push(this.createCharacterAction(charactor));
                if(this.useLeft)
                    this._leftActions.push(this.createCharacterAction(charactor, true));
                if (this.useVertical) {
                    this._verticalRightActions.push(this.createCharacterAction(charactor, false, true));
                    if(this.useLeft)
                        this._verticalLeftActions.push(this.createCharacterAction(charactor, true, true));
                }
            }           
        }

        private createCharacterAction(charactorMap: number[][], isReverse:boolean = false, isVerticalRotation:boolean = false) : HTMLCanvasElement{
            let element = document.createElement("canvas");
            let ctx = element.getContext("2d");
            this.size.width = this.pixSize * charactorMap[0].length;
            this.size.height = this.pixSize * charactorMap.length;

            element.setAttribute("width", this.size.width.toString());
            element.setAttribute("height", this.size.height.toString());
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
            this.currentAction.style.bottom = position.y + 'px';
            this.currentAction.style.zIndex = this.zIndex.toString();
            this.targetDom.appendChild(this.currentAction);
        }

        public refresh() {
            this.currentAction.style.left = this.position.x + 'px';
            this.currentAction.style.bottom = this.position.y + 'px';            
        }

        public destroy(): void {
            this.removeCharacter();
        }

        public getPosition(): Position {
            return this.position;
        }

        public setPosition(pos: Position): void {
            this.position = pos;
        }

        public getCharSize(): Size {
            return this.size;
        }

        public getCurrntElement(): HTMLCanvasElement {
            return this.currentAction;
        }
    }

    export abstract class AbstractCharacter extends AbstractObject implements ICharacter{
        abstract onAction(): void;        
        abstract registerActionCommand(): void;

        public _gameMaster: GameMaster = null;

        private _isStarting = false;
        private _frameTimer: number = null;
        protected _gravity = 2;

        public registerCommand(): void {
            if(!this._gameMaster){
                document.addEventListener('keypress', this.defaultCommand);
            }
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
            if(this._gameMaster && this instanceof AbstractEnemy){
                this._gameMaster.deleteEnemy(<any>this);
            }
            document.removeEventListener('keypress', this.defaultCommand);
            super.destroy();
        }

        protected upperObject: IOtherObject = null;
        protected underObject: IOtherObject = null;
        protected rightObject: IOtherObject = null;
        protected leftObject: IOtherObject = null;

        protected updateEnvironment(): void {
            if(this._gameMaster){
                let objs = this._gameMaster.getApproachedObjects(this.position, this.size.width * 3);
                this.env.ground = null;
                this.env.ceiling = null;
                this.env.right = null;
                this.env.left = null;
                this.upperObject = null;
                this.underObject = null;
                this.rightObject = null;
                this.leftObject = null;
                for(let obj of objs){
                    let oPos = obj.getPosition();
                    let oSize = obj.getCharSize();

                    let oPosLeft = oPos.x + oSize.widthOffset;
                    let oPosRight = oPos.x + oSize.width - oSize.widthOffset;
                    let oPosUnder = oPos.y + /*Magic number*/this.pixSize * 3;
                    let oPosUpper = oPos.y + oSize.height - oSize.heightOffset;

                    let cPosLeft = this.position.x + this.size.widthOffset;
                    let cPosRight = this.position.x + this.size.width - this.size.widthOffset;
                    let cPosUnder = this.position.y;
                    let cPosUpper = this.position.y + this.size.height - this.size.heightOffset;

                    if(cPosLeft >= oPosLeft && cPosLeft <= oPosRight  || cPosRight >= oPosLeft && cPosRight <= oPosRight) {
                        // ground update
                        if(cPosUnder >= oPosUpper && ( this.env.ground === null || this.env.ground > oPosUpper)){
                            this.underObject = obj;
                            this.env.ground = oPosUpper;
                            continue;
                        }
                        // ceiling update
                        if(cPosUpper <= oPosUnder && (this.env.ceiling === null || this.env.ceiling > oPosUnder)){
                            this.upperObject = obj;
                            this.env.ceiling = oPosUnder;
                            continue;
                        }
                        continue;
                   }

                    if(cPosUnder > oPosUnder && cPosUnder < oPosUpper  || cPosUpper > oPosUnder && cPosUpper < oPosUpper) {
                        // left update
                        if(cPosLeft >= oPosRight && ( this.env.left === null || this.env.left < oPosRight)){
                            this.leftObject = obj;
                            this.env.left = oPosRight;
                            continue;
                        }
                        // right update
                        if(cPosRight <= oPosLeft && (this.env.right === null || this.env.right > oPosLeft)){
                            this.rightObject = obj;
                            this.env.right = oPosLeft;  
                            continue;
                        }
                        continue;
                   }

                } 
            }
        }

        protected updateDirection(): boolean{
            let currentDirection = this._direction;
            let right = this.env.right === null ? this.targetDom.clientWidth - this.size.width - (/*Magic offset*/ this.pixSize * 2) : this.env.right;
            let left = this.env.left === null ? 0 : this.env.left;

            if (this.position.x >  right && this._direction == Direction.right) {
                this._direction = Direction.left;
            }
            if (this.position.x < left && this._direction == Direction.left) {
                this._direction = Direction.right;
            }

            return currentDirection != this._direction;
        }
    }

    export abstract class AbstractPlayer extends AbstractCharacter implements IPlayer {
        abstract onGool(callback?: Function): void;
    }

    export abstract class AbstractEnemy extends AbstractCharacter implements IEnemy {
        abstract onStepped(): void;
        abstract onGrabed(): void;
        abstract onKicked(direction: number, kickPower: number): void;
        abstract isKilled(): boolean;
        abstract isStepped(): boolean; 
        abstract drawAction(): void;
    }

    export interface IOtherObject extends IObject{
        onPushedUp(): void;
        onTrampled(): void;
        isActive: boolean;
    }

    export abstract class AbstractOtherObject extends AbstractObject implements IOtherObject {
        abstract onPushedUp(): void;
        abstract onTrampled(): void;
        isActive = true;
    }
}