namespace Character {
    class Position {
        public x: number = 0;
        public y: number = 0;
    }

    export class GameMaster {

        static GAME_MASTERS = {};

        constructor(private targetDom, private charSize) {   
        }

        public static GetController(gameName: string, targetDom, charSize: any): GameMaster {
            let master = GameMaster.GAME_MASTERS[gameName];
            if (master) {
                return master;
            }

            master = new GameMaster(targetDom, charSize);
            GameMaster.GAME_MASTERS[gameName] = master;
            return master;
        }

        private _enemys: AbstractCharacter[] = []
        private _player: AbstractCharacter = null;
        
        public CreateCharInstance<C extends AbstractCharacter>(clz: { new (targetDom, pixSize, position, reverse): C }, position: Position, isReverse = false) : C {

            let char = new clz(this.targetDom, this.charSize, position, isReverse);

            if (char.isEnemy) {
                this._enemys.push(char);
            } else {
                this._player = char;
            }
            char._gameMaster = this;

            return char;
        }

        public getEnemys(): AbstractCharacter[] {
            return this._enemys;
        }

        public init(): void {
            if (this._player) {
                this._player.init();
            }
            for (let enemy of this._enemys) {
                enemy.init();
            }
        }

        public start(): void {
            for (let enemy of this._enemys) {
                enemy.start();
            }
            if (this._player) {
                this._player.start();
            }
            
        }

        public doGameOver(): void {
            for (let enemy of this._enemys) {
                enemy.stop();
            }
        }

        public doGool(): void {
            for (let enemy of this._enemys) {
                enemy.stop();
            }            
        }
    }

    abstract class AbstractCharacter {
        abstract chars: number[][][];
        abstract colors: string[];
        abstract drawAction(): void;        
        abstract registerActionCommand(): void;
        abstract isEnemy: boolean;
        
        protected cssTextTemplate = `z-index: ${this.zIndex}; position: absolute; bottom: 0;`;
        protected currentAction: HTMLCanvasElement = null;
        protected _actions : HTMLCanvasElement[] = [];
        protected _reverseActions : HTMLCanvasElement[]  = [];

        protected charWidth: number = null;
        protected charHeight: number = null;

        public _gameMaster: GameMaster = null;

        private _isStarting = false;
        private _frameTimer: number = null;

        constructor(protected targetDom,protected pixSize = 2, protected position: Position = {x: 0, y:0}, protected _isReverse = false, protected zIndex = 2147483647, protected frameInterval = 45) {
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
            this.charWidth = this.pixSize * charactorMap[0].length + 1;
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
            this.registerCommand();
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

        public getPosition(): Position {
            return this.position;
        }

        public getCharSize(): { height: number, width: number } {
            return { height: this.charHeight, width: this.charWidth };
        }

        protected updateDirection(): boolean{
            let currentDirection = this._isReverse;

            if (this.position.x > this.targetDom.clientWidth - this.charWidth - (/*Magic offset*/ this.pixSize * 2) && this._isReverse == false) {
                this._isReverse = true;
            }
            if (this.position.x < 0 && this._isReverse == true) {
                this._isReverse = false;
            }

            return currentDirection != this._isReverse;
        }

    }


    export class Mario extends AbstractCharacter{
        private static STEP = 2;
        private static DEFAULT_SPEED = 2;
        private _runIndex = 0;
        private _currentStep = Mario.STEP;

        isEnemy = false;

        private _yVector = 0;
        private _jumpPower = 18;
        private _gravity = 2;
        private _speed = Mario.DEFAULT_SPEED;
        private _gameOverWaitCount = 0;


        private _speedUpTimer = null;
        private _speedDownTimer = null;
        private _squatTimer = null;
        private _gameOverTimer = null;

        private _isJumping = false;
        private _isBraking = false;
        private _isSquat = false;


        drawAction(): void {
            if (this.doHitTest()) {
                this.gameOver();
            } else {
                let actionIndex = this.executeRun();
                actionIndex = this.executeJump() || actionIndex;
                this.draw(actionIndex, null, this._isReverse, true);
            }
        }

        private doHitTest(): boolean {
            if (this._gameMaster) {
                let enemys = this._gameMaster.getEnemys();
                for (let enemy of enemys) {
                    let ePos = enemy.getPosition();
                    let eSize = enemy.getCharSize()
                    if (this.position.y > ePos.y + eSize.height)
                        continue;
                    if (ePos.y > this.position.y + this.charHeight)
                        continue;
                    if (this.position.x > ePos.x + eSize.width)
                        continue;
                    if (ePos.x > this.position.x + this.charWidth)
                        continue;

                    return true;
                }
            }
            return false;
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

            if (this._isSquat) {
                return 8;
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

        private onSquat(): void {
            this.onAbortSpeedUp();
            this._isSquat = true;
            if (!this._squatTimer) {
                this._squatTimer = setInterval(() => {
                    if (this._speed > 0) {
                        this._speed--;
                    } else {
                        clearInterval(this._squatTimer);
                        this._squatTimer = null;
                    }
                }, this.frameInterval);
            }
        }

        private onAbortSquat(): void {
            if (this._squatTimer) {
                clearInterval(this._squatTimer);
                this._squatTimer = null;                
            }
            this._speed = Mario.DEFAULT_SPEED;
            this._isSquat = false;
        }

        public gameOver(): void {
            if (this._gameMaster) this._gameMaster.doGameOver();
            this.stop();
            this._gameOverTimer = setInterval(() => {
                if (this._gameOverWaitCount < 20) {
                    this._gameOverWaitCount++;
                    this.draw(9, null, false, true);
                    this._yVector = this._jumpPower * this.pixSize;
                    return;
                }

                this._yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + this._yVector;

                if (this.position.y < this.charHeight * 5 * -1) {
                    clearInterval(this._gameOverTimer);
                    this.destroy();
                    return;
                }

                if (this._currentStep < Mario.STEP) {
                    this._currentStep++;
                } else {
                    this._currentStep = 0;
                    this._runIndex = this._runIndex ^ 1;
                }

                this.draw(9, null, this._runIndex == 0 ? true : false, true);

            }, this.frameInterval);
        }

        private _backgroundOpacity = 0;

        public gool(): void {
            if (this._gameMaster) this._gameMaster.doGool();

            let blackScreen = document.createElement('div');
            if (this.targetDom == document.body)
                this.targetDom.style.cssText = 'margin: 0px;'; // only document body 

            this._gameOverTimer = setInterval(() => {
                if (Math.floor(this._backgroundOpacity) != 1) {
                    this._backgroundOpacity += 0.02;
                } else {
                    this.stop();
                    this.draw(10, null, false, true);
                }
                blackScreen.style.cssText = `z-index: ${this.zIndex - 3}; position: absolute; background-color:black; width: 100%; height: 100%; border: 0;opacity: ${this._backgroundOpacity};`;

            }, this.frameInterval);

            this.targetDom.appendChild(blackScreen);
        }

        registerActionCommand(): void {
            document.addEventListener('keydown', (e) => {
                if (e.keyCode == 65 && !this._isSquat) {
                    this.onJump();
                }
                if (e.keyCode == 66 && !this._isJumping && !this._isSquat) {
                    this.onSpeedUp();
                }

                if (e.keyCode == 40 && !this._isJumping) {
                    this.onSquat();
                }

            });
            document.addEventListener('keyup', (e) => {
                if (e.keyCode == 65) {
                    this.onAbortJump();
                }
                if (e.keyCode == 66) {
                    this.onAbortSpeedUp();
                }
                if (e.keyCode == 40) {
                    this.onAbortSquat();
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
        ],[
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 3, 6, 6, 6, 6, 3, 3, 0, 0, 0, 0, 0],
            [ 0, 0, 3, 6, 6, 6, 6, 6, 7, 6, 6, 3, 0, 0, 0, 0],
            [ 0, 3, 7, 7, 3, 3, 6, 7, 6, 6, 8, 6, 3, 0, 0, 0],
            [ 0, 3, 7, 3, 2, 2, 3, 7, 7, 9, 8, 2, 3, 0, 0, 0],
            [ 0, 3, 3, 2, 2, 2, 2, 3, 7, 6, 1, 1, 1, 1, 0, 0],
            [ 0, 5, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 0],
            [ 5,13, 1, 3, 3, 3, 3, 7,10,10,10,10,10,10, 4, 0],
            [ 5,13, 3, 7, 7, 7, 3,12, 1,11,11,11,11,11, 4, 0],
            [ 5,13, 3, 7, 7, 3,13,13, 5, 1, 1, 1, 1, 1, 0, 0],
            [ 5,13,13, 3, 3,13, 5, 5,12, 5, 1, 1, 1, 0, 0, 0],
            [ 5, 5,13,13, 5, 5, 4, 1, 4, 1, 0, 0, 0, 0, 0, 0],
            [ 0, 5, 5, 5, 4, 4, 4, 8, 1, 8, 1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]            
        ], [
            [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 3, 3, 6, 8, 8, 6, 3, 3, 0, 0, 0, 0],
            [ 0, 0, 0, 3, 6, 6, 2, 8, 8, 2, 6, 6, 3, 0, 0, 0],
            [ 0, 0, 3, 6, 6, 6, 1, 1, 1, 1, 6, 6, 6, 3, 0, 0],
            [ 0, 0, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 6, 3, 0, 0],
            [ 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0],
            [ 0, 0, 0, 3, 1, 6, 1, 6, 6, 1, 6, 1, 3, 0, 0, 0],
            [ 0, 0, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0],
            [ 0, 0, 1, 1, 6,11, 1,11,11, 1,11, 6, 1, 1, 0, 0],
            [ 0, 4,10, 1,11,11, 2, 2, 2, 2,11,11, 1,10, 4, 0],
            [ 0, 4,10, 1, 1,10,10,10,10,10,10, 1, 1,10, 4, 0],
            [ 0, 4,11, 1,10, 1,11,11,11,11, 1,10, 1,11, 4, 0],
            [ 4, 2, 4,10, 1, 1, 1, 1, 1, 1, 1, 1,10, 4, 0, 0],
            [ 4, 2, 2, 4,10,10,10, 3, 3,10,10,10, 4, 4, 4, 0],
            [ 0, 4, 6, 6, 4, 4,10, 7, 7,10, 4, 4, 6, 2, 2, 4],
            [ 0, 4, 3, 6, 5, 4,10, 6, 6,10, 4, 1, 1, 1, 2, 4],
            [ 0, 0, 0, 5,12,12, 4,10,10, 4, 2, 1, 1, 1, 1, 0],
            [ 0, 0, 0, 5,12, 2, 2, 4, 4, 2, 2, 1, 1, 1, 1, 0],
            [ 0, 0, 1, 1, 1, 2, 2,13,13,13, 5, 1, 1, 1, 1, 0],
            [ 0, 1, 8, 4, 4, 1, 5, 5, 5, 5, 0, 1, 1, 1, 1, 0],
            [ 0, 1, 1, 1, 1, 4, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [ 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]            
        ], [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 3, 3, 6, 8, 8, 6, 3, 3, 0, 0, 0],
            [ 1, 1, 0, 1, 1, 6, 6, 2, 8, 8, 2, 6, 6, 3, 0, 0],
            [ 1, 2, 1, 2, 1, 6, 6, 1, 1, 1, 1, 6, 6, 6, 3, 0],
            [ 0, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 3, 0],
            [ 1, 2, 1, 1, 1,11,11, 1,11,11, 1,11,11, 1, 3, 0],
            [ 1, 1, 1, 2, 1,10,10, 1,10,10, 1,10,10, 1, 4, 0],
            [ 1, 2, 1, 2, 1, 1,10,10,10,10,10,10, 1, 1,10, 4],
            [ 0, 1, 1, 1, 3,10, 1,11,11,11,11, 1,10, 4,11, 4],
            [ 0, 3, 7, 6, 3,11, 1, 1, 1, 1, 1, 1,11, 4, 4, 0],
            [ 0, 0, 3, 7, 6, 4,11, 1, 1, 1, 1,11, 4, 7, 7, 4],
            [ 0, 0, 3, 7, 6, 3, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4],
            [ 0, 0, 0, 3, 6, 5,12,12,12,12,12, 7, 7, 2, 2, 4],
            [ 0, 0, 0, 0, 5,13,12, 2, 2,12,12, 2, 4, 2, 2, 4],
            [ 0, 0, 0, 0, 5,13,13, 2, 2,12,12, 2, 5, 4, 4, 0],
            [ 0, 0, 0, 5,13,13,13,13,13,12,12,12,12, 5, 0, 0],
            [ 0, 0, 0, 5,13,13,13,13,13,13,13,12,12, 5, 0, 0],
            [ 0, 0, 5,13,13,13,13,13,13,13,13,13,13, 5, 0, 0],
            [ 0, 1, 4, 4, 4, 5, 5, 5, 5, 5, 5, 4, 4, 4, 1, 0],
            [ 1, 4, 8, 4, 1, 0, 0, 0, 0, 0, 0, 1, 4, 8, 4, 1],
            [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
        ]];

    }

    export class Goomba extends AbstractCharacter {
        colors = ['','#000000','#ffffff','#b82800','#f88800','#f87800','#f8c000','#f8f800'];
        chars = [[
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,3,3,3,3,1,1,0,0,0,0],
            [0,0,0,1,4,1,1,1,1,3,3,3,1,1,1,1],
            [0,0,1,4,2,4,3,1,1,1,3,1,1,1,0,0],
            [0,1,3,3,4,3,3,3,2,1,1,1,2,3,1,0],
            [0,1,3,3,3,3,3,2,2,2,3,2,2,2,3,1],
            [1,3,3,3,3,3,3,2,2,1,3,1,2,2,3,1],
            [1,3,3,3,3,3,3,3,2,2,3,2,2,3,3,1],
            [1,3,3,3,3,3,3,4,4,4,4,4,4,3,3,1],
            [0,1,3,3,3,4,4,2,1,1,1,1,2,3,1,0],
            [0,5,5,5,4,4,1,1,4,4,4,4,1,4,4,0],
            [5,6,6,7,5,5,4,4,4,4,4,4,4,1,4,0],
            [1,6,6,7,7,2,5,0,0,0,0,1,1,7,2,1],
            [0,1,1,6,7,7,5,1,1,1,1,6,6,1,1,0],
            [0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0]
        ],[
            [0.0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,3,3,3,3,1,1,0,0,0,0],
            [0,0,0,1,4,3,3,3,1,1,1,3,1,1,1,0],
            [0,0,1,4,2,4,3,3,3,3,1,1,3,1,1,0],
            [0,1,3,3,4,3,3,3,3,3,2,1,1,1,2,0],
            [0,1,3,3,3,3,3,3,3,2,2,2,1,2,2,0],
            [1,3,3,3,3,3,3,3,3,2,2,1,3,1,2,1],
            [1,3,3,3,3,3,3,3,3,3,2,2,3,2,2,1],
            [1,3,3,3,3,3,3,3,3,4,4,4,4,4,4,1],
            [0,1,3,3,3,3,3,4,4,2,1,1,1,1,1,0],
            [0,1,3,3,3,3,4,4,1,1,4,4,4,4,1,0],
            [0,0,1,3,3,4,4,4,4,4,4,4,4,1,0,0],
            [0,0,0,1,1,5,5,5,5,5,4,1,1,0,0,0],
            [0,0,0,0,0,5,6,6,7,7,5,0,0,0,0,0],
            [0,0,0,0,0,5,6,6,6,6,2,5,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0]
            ]];


        private _speed = 1;
        private static STEP = 2;
        private _currentStep = 0;
        private _actionIndex = 0;
        isEnemy = true;

        drawAction(): void {
            let directionUpdated = this.updateDirection();

            if (this.doHitTestWithOtherEnemy()) {
                this._isReverse = !this._isReverse;
            }

            if (!this._isReverse) {
                this.position.x += this.pixSize * this._speed;
            } else {
                this.position.x -= this.pixSize * this._speed;            
            }

            if (this._currentStep < Goomba.STEP) {
                this._currentStep++;
            } else {
                this._currentStep = 0;
                this._actionIndex = this._actionIndex ^ 1;
            }

            this.draw(this._actionIndex, null, this._isReverse, true);
        }

        private doHitTestWithOtherEnemy(): boolean {
            if (this._gameMaster) {
                let enemys = this._gameMaster.getEnemys();
                for (let enemy of enemys) {
                    if (enemy != this) {
                        let ePos = enemy.getPosition();
                        let eSize = enemy.getCharSize()
                        if (this.position.y > ePos.y + eSize.height)
                            continue;
                        if (ePos.y > this.position.y + this.charHeight)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.charWidth)
                            continue;
                        return true;
                    }
                }
            }
            return false;

        }

        registerActionCommand(): void {
        }
    }

}

let master = Character.GameMaster.GetController('sample' ,document.body, 10);
var mario = master.CreateCharInstance(Character.Mario, { x: 0, y: 0 });

//var goomba1 = master.CreateCharInstance(Character.Goomba, { x: 300, y: 0 }, false);
//var goomba2 = master.CreateCharInstance(Character.Goomba, {x: 500,y:0}, true);
//var goomba3 = master.CreateCharInstance(Character.Goomba, {x: 800,y:0}, true);

master.init();
master.start();


//goomba1.start();
//goomba2.start();
//goomba3.start();
//mario.registerCommand();
//mario.draw()
//mario.draw(0, {x:0, y:0});
//mario.draw(1, {x:100, y:0});
//mario.draw(2, {x:200, y:0});
//mario.draw(3, {x:300, y:0});
//mario.draw(4, {x:400, y:0});
//mario.draw(5, {x:500, y:0});
//mario.draw(6, {x:600, y:0});
//mario.draw(7, {x:700, y:0});
//mario.draw(8, {x:800, y:0});
//mario.draw(9, {x:800, y:0});
//mario.draw(10, {x:900, y:0});
mario.gool();
