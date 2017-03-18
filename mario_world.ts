namespace Charactor {
    class Position {
        public x: number = 0;
        public y: number = 0;
    }

    abstract class AbstractCharacter {
        abstract chars: number[][][];
        abstract colors: string[];
        abstract drawAction(): void;        
        abstract registerActionCommand(): void;

        protected cssTextTemplate = "z-index: 2147483647; position: absolute; bottom: 0;";
        protected currentAction: HTMLCanvasElement = null;
        protected _actions : HTMLCanvasElement[] = [];
        protected _reverseActions : HTMLCanvasElement[]  = [];

        private _isStarting = false;
        private _frameTimer: number = null;

        constructor(protected targetDom,protected pixSize = 2, protected positon: Position = {x: 0, y:0}, private interval = 45) {
        }

        public init(): void{
             for (let charactor of this.chars) {
                this._actions.push(this.createCharacterAction(charactor));
                this._reverseActions.push(this.createCharacterAction(charactor, true));
            }           
        }

        private createCharacterAction(charactorMap: number[][], isReverse:boolean = false) : HTMLCanvasElement{
            let element = document.createElement("canvas");
            let ctx = element.getContext("2d");
            let charWidth = this.pixSize * charactorMap[0].length;
            let charHeight = this.pixSize * charactorMap.length;
            element.setAttribute("width", charWidth.toString());
            element.setAttribute("height", charHeight.toString());
            element.style.cssText = this.cssTextTemplate;
            AbstractCharacter.drawCharacter(ctx, charactorMap, this.colors, this.pixSize, isReverse);
            return element;
        }    

        private static drawCharacter(ctx:CanvasRenderingContext2D, map:number[][], colors:string[], size:number, isReverse: boolean) : void {
            for (let y = 0; y < map.length; y++){
                if (isReverse)
                    map[y].reverse();
                for (let x = 0; x < map[y].length; x++){
                    if (map[y][x] != 0) {
                        ctx.beginPath();
                        ctx.rect(x * size, y * size, size, size);
                        ctx.fillStyle = colors[map[y][x]];
                        ctx.fill();
                    }
                }
                if (isReverse) {
                    map[y].reverse();
                }
            }
        }

        protected removeCharactor(): void {
            if (this.currentAction != null) {
                this.targetDom.removeChild(this.currentAction);
                this.currentAction = null;
            }
        }

        public draw(index: number = 0, positionX: number = null, isReverse: boolean = false): void {
            this.currentAction = !isReverse ? this._actions[index] : this._reverseActions[index]; 
            this.currentAction.style.left = (positionX!=null?positionX:this.positon.x) * this.pixSize + 'px';
            this.targetDom.appendChild(this.currentAction);
        }

        public registerCommand(): void {
            document.addEventListener('keypress', (e) => {
                if (e.keyCode == 32) {
                    if (this._isStarting) {
                        this.stop();
                    } else {
                        this.start();
                    }
                }
            });

            this.registerActionCommand();
        }

        public start(): void {
            this._isStarting = true;
            this._frameTimer = setInterval(() => { this.drawAction() }, this.interval);
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
            this.removeCharactor();
        }

    }


    export class Mario extends AbstractCharacter{
        private static STEP = 2;
        colors = ['','#000000','#ffffff','#520000','#8c5a18','#21318c','#ff4273','#b52963','#ffde73','#dea539','#ffd6c6','#ff736b','#84dece','#42849c'];
        chars = [[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 7, 6,13,13,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 4, 4, 4,13, 2, 2,12, 2, 5, 0, 0, 0],
            [ 0, 0, 0, 4, 2, 2, 2, 4, 2, 2,12, 2, 5, 0, 0, 0],
            [ 0, 0, 0, 4, 2, 2, 4,13,13,13,12,12, 5, 0, 0, 0],
            [ 0, 0, 0, 4, 2, 2, 4,13,13, 5,13, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 4, 4, 4, 4, 1, 4, 1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 0, 0, 0, 4, 7, 7, 7, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 4, 4, 4, 4,13,13,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 1, 4, 2, 2, 2, 4, 2, 2,12, 2, 5, 1, 1, 0],
            [ 0, 1, 3, 4, 2, 2, 4, 4, 2, 2,12, 2, 1, 8, 1, 1],
            [ 0, 1, 3, 4, 2, 2, 4,13,13,13,12, 5, 1, 4, 1, 1],
            [ 0, 1, 3, 1, 4, 4,13,13,13,13, 5, 1, 4, 1, 1, 0],
            [ 0, 1, 3, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
            [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0], 
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 4, 0], 
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 4], 
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 2, 2, 2, 4], 
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 2, 4, 0], 
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 4, 4, 0], 
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0], 
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 3, 0, 0, 0], 
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0], 
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0], 
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0], 
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0], 
            [ 0, 4, 4, 4, 7, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0], 
            [ 4, 4, 2, 2, 4, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0], 
            [ 4, 2, 2, 2, 2, 4, 7,13,13,12,12, 5, 0, 0, 0, 0], 
            [ 4, 2, 2, 2, 2, 4,13,13, 2, 2,12, 2, 5, 1, 1, 0], 
            [ 0, 4, 2, 2, 4,13,13,13, 2, 2,12, 2, 1, 8, 1, 1], 
            [ 0, 1, 3, 4,13,13,13,13,13,13,12, 5, 1, 4, 1, 1], 
            [ 0, 1, 3, 5, 5, 5,13,13,13,13, 5, 1, 4, 1, 1, 0], 
            [ 0, 1, 3, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0], 
            [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0] 
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0], 
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0], 
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0], 
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0], 
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
            [ 0, 0, 3, 7, 1, 1, 1, 1, 1,11, 1, 1, 0, 0, 0, 0], 
            [ 0, 3, 7, 7, 1, 1,10,10,10,10,10,10, 0, 0, 0, 0], 
            [ 0, 3, 7,10, 1, 1,10,10, 1,10, 1,10, 0, 0, 0, 0], 
            [ 0, 3,10, 4,10, 1,10,10, 1,10, 1,10, 4, 4, 0, 0], 
            [ 0, 1,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0], 
            [ 0, 0, 1,11,11, 1,10,10, 1,11,11,11,11,11, 4, 0], 
            [ 0, 4, 2, 2, 3,11,11, 1, 1, 1, 1, 1, 1, 1, 2, 3], 
            [ 4, 2, 2, 2, 2, 3,11,11,11, 1, 1, 1, 1, 2, 2, 3], 
            [ 4, 2, 2, 2, 2, 3, 4, 4, 4, 4, 5, 4, 2, 1, 1, 0], 
            [ 0, 4, 2, 2, 3,13,13,13,13,12,12, 5, 1, 8, 1, 1], 
            [ 0, 1, 3, 3, 5,13,13,13, 2, 2,12, 2, 1, 4, 1, 1], 
            [ 0, 1, 4, 4, 5,13,13,13, 2, 2,12, 2, 1, 4, 1, 1], 
            [ 0, 1, 4, 8, 5, 5,13,13,13,13,12, 5, 1, 4, 1, 1], 
            [ 0, 0, 1, 1, 0, 5, 5,13,13,13, 5, 0, 0, 1, 1, 0], 
            [ 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0], 
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 4, 4, 4, 4, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 4, 2, 2, 2, 4, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 0, 4, 2, 2, 4, 7, 7,13,13,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 4, 4, 7, 7,13,13, 2, 2,12, 2, 5, 0, 0, 0],
            [ 0, 0, 0, 5,13,13,13,13, 2, 2,12, 2, 5, 0, 0, 0],
            [ 0, 0, 0, 5,13,13,13,13,13,13,12,12, 5, 0, 0, 0],
            [ 0, 0, 0, 5, 5,13,13,13,13, 5,13, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 4, 4, 4, 4, 1, 4, 1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 6, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 0, 0, 3, 7, 6, 7, 7, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 0, 0, 3, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 3,10, 1, 1, 1,11, 1,11, 1,11, 0, 0, 0, 0],
            [ 0, 3,10, 4,10, 1,11,10, 1,10, 1,10, 4, 4, 0, 0],
            [ 0, 3,11, 4,10, 1, 1,10,10,10,10,10,10,10, 4, 0],
            [ 0, 3, 1,11,10, 1,10,10, 1,11,11,11,11,11, 4, 0],
            [ 0, 0, 1, 1,11,11,10, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [ 4, 4, 4, 4, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 4, 2, 2, 2, 4, 7, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0],
            [ 0, 4, 2, 2, 4, 7,13,13,13,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 4, 4, 7, 7,13,13, 2, 2,12, 2, 5, 1, 1, 0],
            [ 0, 1, 3, 3,13,13,13,13, 2, 2,12, 2, 1, 8, 1, 1],
            [ 0, 1, 3, 3,13,13,13,13,13,13,12, 5, 1, 4, 1, 1],
            [ 0, 1, 3, 1, 5, 5,13,13,13,13, 5, 1, 4, 1, 1, 0],
            [ 0, 1, 3, 8, 1, 0, 5, 5, 5, 5, 0, 1, 4, 1, 1, 0],
            [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]];

        private _runIndex = 0;
        private _currentStep = Mario.STEP;

        private _yVector = 0;
        private _jumpPower = 18;
        private _gravity = 2;
        private _speed = 2;

        private _sppedUpTimer = null;
        private _sppedDownTimer = null;

        private _isReverse = false;
        private _isJumping = false;

        drawAction(): void {
            let target = this.targetDom;
            this.removeCharactor();

            let runIndex = this._runIndex;

            if (this._currentStep < Mario.STEP) {
                this._currentStep++;
            } else {
                this._currentStep = 0;
                this._runIndex = this._runIndex ^ 1;
            }

            if (this._speed > 8) {
                runIndex = this._runIndex == 0 ? 4 : 5;
            } else {
                runIndex = this._runIndex;
            }

            this.currentAction = !this._isReverse ? this._actions[runIndex] : this._reverseActions[runIndex]; 


            if (this._isJumping) {
                this._yVector -= this._gravity * this.pixSize;
                this.positon.y = this.positon.y + this._yVector;

                if (this.positon.y <= 0) {
                    this._isJumping = false;
                    this._yVector = 0;
                    this.positon.y = 0;
                } else {
                    if (this._yVector > 0) {
                        this.currentAction = !this._isReverse ? this._actions[2] : this._reverseActions[2];                         
                    } else {
                        this.currentAction = !this._isReverse ? this._actions[3] : this._reverseActions[3];                                                 
                    }
                }
                this.currentAction.style.bottom = this.positon.y + 'px';
            }

            this.currentAction.style.left = this.positon.x + 'px';

            this.targetDom.appendChild(this.currentAction);
            if (this.positon.x > this.targetDom.clientWidth - this.pixSize * 18 && this._isReverse == false) {
                this._isReverse = true;
            }
            if (this.positon.x < 0 && this._isReverse == true) {
                this._isReverse = false;
            }
            if (!this._isReverse) {
                this.positon.x += this.pixSize * this._speed;
            } else {
                this.positon.x -= this.pixSize * this._speed;            
            }
        }

        registerActionCommand(): void {
            document.addEventListener('keydown', (e) => {
                if (e.keyCode == 65) {
                    this.jump();
                }
                if (e.keyCode == 66 && !this._isJumping) {
                    if (!this._sppedUpTimer) {
                        this._sppedUpTimer = setInterval(() => {
                            if (this._speed < 10) {
                                this._speed++;
                            } else {
                                clearInterval(this._sppedUpTimer);
                                this._sppedUpTimer = null;
                            }
                        }, 45);
                    }
                }
            });
            document.addEventListener('keyup', (e) => {
                if (e.keyCode == 65) {
                    if (this._yVector > 0) {
                        this._yVector = 0;
                    }
                }
                if (e.keyCode == 66) {
                    if (!this._sppedDownTimer) {
                        this._sppedDownTimer = setInterval(() => {
                            if (this._speed > 2) {
                                this._speed--;
                            } else {
                                clearInterval(this._sppedDownTimer);
                                this._sppedDownTimer = null;
                            }
                        }, 45);
                    }
                }
            });
        }

        private jump() {
            if (!this._isJumping) {
                this._isJumping = true;
                this._yVector = this._jumpPower * this.pixSize;
            }
        }

    }
}

var mario = new Charactor.Mario(document.body, 3)
mario.init();
mario.registerCommand();
mario.draw();
