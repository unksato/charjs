namespace Character {
    class Position {
        public x: number = 0;
        public y: number = 0;
    }

    abstract class AbstractCharacter {
        abstract chars: number[][][];
        abstract colors: string[];
        abstract drawAction(): void;        
        abstract registerActionCommand(): void;
        
        protected cssTextTemplate = `z-index: ${this.zIndex}; position: absolute; bottom: 0;`;
        protected currentAction: HTMLCanvasElement = null;
        protected _actions : HTMLCanvasElement[] = [];
        protected _reverseActions : HTMLCanvasElement[]  = [];

        protected charWidth: number = null;
        protected charHeight: number = null;

        private _isStarting = false;
        private _frameTimer: number = null;

        constructor(protected targetDom,protected pixSize = 2, protected position: Position = {x: 0, y:0}, private zIndex = 2147483647, protected frameInterval = 45) {
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
            this.charWidth = this.pixSize * charactorMap[0].length;
            this.charHeight = this.pixSize * charactorMap.length;

            element.setAttribute("width", this.charWidth.toString());
            element.setAttribute("height", this.charHeight.toString());
            element.style.cssText = this.cssTextTemplate;
            AbstractCharacter.drawCharacter(ctx, charactorMap, this.colors, this.pixSize, isReverse);
            return element;
        }    

        private static drawCharacter(ctx:CanvasRenderingContext2D, map:number[][], colors:string[], size:number, reverse: boolean) : void {
            for (let y = 0; y < map.length; y++){
                if (reverse)
                    map[y].reverse();
                for (let x = 0; x < map[y].length; x++){
                    if (map[y][x] != 0) {
                        ctx.beginPath();
                        ctx.rect(x * size, y * size, size, size);
                        ctx.fillStyle = colors[map[y][x]];
                        ctx.fill();
                    }
                }
                if (reverse) {
                    map[y].reverse();
                }
            }
        }

        protected removeCharacter(): void {
            if (this.currentAction != null) {
                this.targetDom.removeChild(this.currentAction);
                this.currentAction = null;
            }
        }

        public draw(index: number = 0, position: Position = null, reverse: boolean = false, removeCurrent = false): void {
            if (removeCurrent) this.removeCharacter();
            position = position || this.position;
            this.currentAction = !reverse ? this._actions[index] : this._reverseActions[index]; 
            this.currentAction.style.left = position.x + 'px';
            this.currentAction.style.bottom = this.position.y + 'px';
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
            this._frameTimer = setInterval(() => { this.drawAction() }, this.frameInterval);
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
        }

    }


    export class Mario extends AbstractCharacter{
        private static STEP = 2;
        private _runIndex = 0;
        private _currentStep = Mario.STEP;

        private _yVector = 0;
        private _jumpPower = 18;
        private _gravity = 2;
        private _speed = 2;

        private _speedUpTimer = null;
        private _speedDownTimer = null;

        private _isReverse = false;
        private _isJumping = false;
        private _isBraking = false;

        drawAction(): void {
            let actionIndex = this.executeRun();
            actionIndex = this.executeJump() || actionIndex;
            this.draw(actionIndex, null, this._isReverse, true);
        }

        private updateDirection(): boolean{
            let currentDirection = this._isReverse;

            if (this.position.x > this.targetDom.clientWidth - this.charWidth - (/*Magic offset*/ this.pixSize * 2) && this._isReverse == false) {
                this._isReverse = true;
            }
            if (this.position.x < 0 && this._isReverse == true) {
                this._isReverse = false;
            }

            return currentDirection != this._isReverse;
        }

        private executeJump(): number {
            if (this._isJumping) {
                this._yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + this._yVector;
                if (this.position.y <= 0) {
                    this._isJumping = false;
                    this._yVector = 0;
                    this.position.y = 0;
                    return null;
                } else {
                    if (this._speed > 8) {
                        if (this._yVector > 0 && this.position.y < this.charHeight * 3) {
                            return null;
                        } else {
                            return 7;
                        }
                    } else {
                        return this._yVector > 0 ? 2 : 3;
                    }
                }
            } else {
                return null;
            }   
        }

        private executeRun(): number {
            let directionUpdated = this.updateDirection();
            
            if (!this._isReverse) {
                this.position.x += this.pixSize * this._speed;
            } else {
                this.position.x -= this.pixSize * this._speed;            
            }

            let runIndex = this._runIndex;

            if (this._currentStep < Mario.STEP) {
                this._currentStep++;
            } else {
                this._currentStep = 0;
                this._runIndex = this._runIndex ^ 1;
            }

            // Speed up action
            if (this._speed > 8) {
                runIndex = this._runIndex == 0 ? 4 : 5;
            } else {
                runIndex = this._runIndex;
            }

            // Braking action
            if (!this._isJumping) {
                if (this._speed > 5 || (!directionUpdated && this._isBraking)) {
                    if ((this._isReverse && this.position.x < this.charWidth * 3) ||
                        (!this._isReverse && this.position.x > this.targetDom.clientWidth - this.charWidth * 4)
                    ) {
                        debugger;
                        runIndex = 6;
                        if (this._speed > 2)
                            this._speed--;
                        this._isBraking = true;
                    }
                } else {
                    this._isBraking = false;
                }
            }
            return runIndex;
        }

        private onJump(): void {
            if (!this._isJumping) {
                this._isJumping = true;
                this._yVector = this._jumpPower * this.pixSize;
            }
        }

        private onAbortJump(): void {
            if (this._yVector > 0) {
                this._yVector = 0;
            }
        }

        private onSpeedUp(): void {
            if (!this._speedUpTimer) {
                if (this._speedDownTimer) {
                    clearInterval(this._speedDownTimer);
                    this._speedDownTimer = null;
                }
                this._speedUpTimer = setInterval(() => {
                    if (this._speed < 10) {
                        if(!this._isBraking)
                            this._speed++;
                    } else {
                        clearInterval(this._speedUpTimer);
                        this._speedUpTimer = null;
                    }
                }, this.frameInterval);
            }
        }

        private onAbortSpeedUp(): void {
            if (!this._speedDownTimer) {
                this._speedDownTimer = setInterval(() => {
                    if (this._speedUpTimer) {
                        clearInterval(this._speedUpTimer);
                        this._speedUpTimer = null;
                    }
                    if (this._speed > 2) {
                        this._speed--;
                    } else {
                        clearInterval(this._speedDownTimer);
                        this._speedDownTimer = null;
                        this._isBraking = false;
                    }
                }, this.frameInterval);
            }
        }

        registerActionCommand(): void {
            document.addEventListener('keydown', (e) => {
                if (e.keyCode == 65) {
                    this.onJump();
                }
                if (e.keyCode == 66 && !this._isJumping) {
                    this.onSpeedUp();
                }
            });
            document.addEventListener('keyup', (e) => {
                if (e.keyCode == 65) {
                    this.onAbortJump();
                }
                if (e.keyCode == 66) {
                    this.onAbortSpeedUp();
                }
            });
        }

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
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 6, 8, 6, 6, 6, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 2, 8, 8, 7, 7, 7, 7, 3, 0, 0, 0],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 3, 0, 0],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 3, 0],
            [ 0, 0, 0, 0,11,11,11,11,11, 1, 1, 1, 1, 7, 3, 0],
            [ 0, 0, 0, 0,10, 1,10, 1,10,11, 1, 1,10, 7, 7, 3],
            [ 0, 0, 4, 4,10, 1,10, 1,10,10, 1,10, 4,10, 7, 3],
            [ 0, 4,10,10,10,10,10,10,10, 1, 1,10, 4,11, 7, 3],
            [ 0, 4,11,11,11,11,11, 1,10,10, 1,10,11, 1, 3, 0],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 4, 4, 4,11, 1, 1, 7, 3],
            [ 0, 0, 0, 1, 1, 1, 1, 4, 2, 2, 4, 4, 1, 2, 7, 3],
            [ 0, 0, 0, 0, 3, 7, 7, 2, 2, 2, 2, 4, 2, 2, 2, 4],
            [ 0, 0, 0, 0, 5, 3, 3, 2, 2, 2, 2, 4, 2, 2, 2, 4],
            [ 0, 0, 0, 0, 5,13, 3, 3, 3, 2, 4, 4, 4, 2, 4, 0],
            [ 0, 0, 0, 0, 5,13, 4, 8, 4, 4,13, 2, 2, 4, 0, 0],
            [ 0, 0, 0, 0, 0, 1, 4, 4, 1, 1,13,13,13, 5, 0, 0],
            [ 0, 0, 0, 0, 0, 1, 4, 1, 1, 1, 5,13,13,13, 5, 0],
            [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 4, 4, 1, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 8, 1],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
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
            [ 0, 0, 0, 1, 4, 4,11,11,11, 1, 1, 1, 1, 0, 0, 0],
            [ 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0],
            [ 1, 8, 4, 2, 2, 2, 4, 7, 4,12, 5, 0, 0, 0, 0, 0],
            [ 0, 1, 4, 4, 2, 2, 4, 7, 4,12,12, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 5, 4, 4, 4, 2, 2,12, 2, 5, 0, 0, 0, 0],
            [ 0, 0, 0, 1, 1,13,13,13, 2,12, 2, 5, 0, 0, 0, 0],
            [ 0, 0, 1, 4, 4, 5,13,13,13,13, 5, 0, 0, 0, 0, 0],
            [ 0, 0, 1, 4, 4, 4, 5,13, 5, 5, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 1, 8, 1, 1, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]];

    }
}

var mario = new Character.Mario(document.body, 3)
mario.init();
mario.registerCommand();
mario.draw()
//mario.draw(0, {x:0, y:0});
//mario.draw(1, {x:100, y:0});
//mario.draw(2, {x:200, y:0});
//mario.draw(3, {x:300, y:0});
//mario.draw(4, {x:400, y:0});
//mario.draw(5, {x:500, y:0});
//mario.draw(6, {x:600, y:0});
//mario.draw(7, {x:700, y:0});
