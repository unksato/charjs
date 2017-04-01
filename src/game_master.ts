namespace Charjs {
    export class GameMaster {

        static GAME_MASTERS = {};

        constructor(private targetDom, private charSize, private frameInterval = 45) {   
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

        private _enemys: {[key:string]:IEnemy} = {}
        private _enemyCount = 0;
        private _objects: {[key:string]:IOtherObject} = {}
        private _objectCount = 0;

        private _player: IPlayer = null;
        
        private _isStarting = false;

        public CreatePlayerInstance<C extends AbstractPlayer>(clz: { new (targetDom, pixSize, position, direction, frame): C }, position: Position, direction = Direction.right) : C {
            let char = new clz(this.targetDom, this.charSize, position, direction, this.frameInterval);
            char._name = 'player';
            this._player = <any>char;
            char._gameMaster = this;
            return char;
        }

        public CreateEnemyInstance<C extends AbstractEnemy>(clz: { new (targetDom, pixSize, position, direction, frame): C }, position: Position, direction = Direction.right) : C {
            let char = new clz(this.targetDom, this.charSize, position, direction, this.frameInterval);
            char._name = 'enemy_' + this._enemyCount;
            this._enemyCount++;
            this._enemys[char._name] = <any>char;
            char._gameMaster = this;
            return char;
        }

        public CreateObjectInstance<C extends AbstractOtherObject>(clz: { new (targetDom, pixSize, position, direction, frame): C }, position: Position) : C {
            let char = new clz(this.targetDom, this.charSize, position, Direction.left, this.frameInterval);
            char._name = 'obj_' + this._objectCount;
            this._objectCount++;
            this._objects[char._name] = <any>char;
            return char;
        }

        public deleteEnemy(char : IEnemy) {
            delete this._enemys[char._name];
            if(Object.keys(this._enemys).length == 0){
                this.doGool();
            }
        }

        public getEnemys(): {[name:string]:IEnemy} {
            return this._enemys;
        }

        public getApproachedObjects(pos: Position, radius: number): IOtherObject[] {
            let objs = [];

            for(let name in this._objects){
                if(this._objects[name].isActive){
                    let objPos = this._objects[name].getPosition();
                    if( pos.x - radius < objPos.x && objPos.x < pos.x + radius &&
                        pos.y - radius < objPos.y && objPos.y < pos.y + radius){
                            objs.push(this._objects[name]);
                        }
                }
            }
            return objs;
        }

        public init(): void {
            if (this._player) {
                this._player.init();
            }
            for (let name in this._enemys) {
                this._enemys[name].init();
            }
            for (let name in this._objects) {
                this._objects[name].init();
            }

            this.registerCommand();
        }

        public isStarting(): boolean {
            return this._isStarting;
        }

        public registerCommand(): void {
            document.addEventListener('keypress', this.defaultCommand);
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
            for (let name in this._enemys) {
                this._enemys[name].start();
            }
            if (this._player) {
                this._player.start();
            }

            this._isStarting = true;
        }

        public stop(): void {
            for (let name in this._enemys) {
                this._enemys[name].stop();
            }
            if (this._player) {
                this._player.stop();
            }

            this._isStarting = false;
        }

        public doGameOver(): void {
            for (let name in this._enemys) {
                this._enemys[name].stop();
            }
        }

        public doGool(): void {
            for (let name in this._enemys) {
                this._enemys[name].stop();
            }

            let screen = document.body;

            let blackScreen = document.createElement('div');
            screen.style.margin = "0px";

            let backgroundOpacity = 0;

            let goolDimTimer = setInterval(() => {
                if (Math.floor(backgroundOpacity) != 1) {
                    backgroundOpacity += 0.01;
                } else {
                    clearInterval(goolDimTimer);
                    this._player.stop();
                    this._player.onGool(() => {

                    let goolDimOffTimer = setInterval(() => {

                        if (backgroundOpacity.toFixed(2) != "0.20") {
                            backgroundOpacity -= 0.02;
                        } else {
                            clearInterval(goolDimOffTimer);

                            this._player.start();

                            let pos = this._player.getPosition();
                            let circleSize =  screen.clientWidth > screen.clientHeight ? screen.clientWidth  : screen.clientHeight ;
                            let circleAnimationCount = 0;
                            let circleTimer = setInterval(() => {
                                circleSize-=20;
                                this.drawBlackClipCircle(screen, pos, circleSize, circleAnimationCount);
                                circleAnimationCount++;
                                if(circleSize <= 0){
                                    clearInterval(circleTimer);
                                    this._player.destroy();
                                }
                            }, this.frameInterval);
                        }
                        blackScreen.style.cssText = `z-index: ${this._player.zIndex - 3}; position: absolute; background-color:black; width: 100%; height: 100%; border: 0;opacity: ${backgroundOpacity};`;

                    }, this.frameInterval / 2);


                    });
                }
                blackScreen.style.cssText = `z-index: ${this._player.zIndex - 1}; position: absolute; background-color:black; width: 100%; height: 100%; border: 0;opacity: ${backgroundOpacity};`;
            }, this.frameInterval);  

            document.body.appendChild(blackScreen);
        }

        private drawBlackClipCircle(targetDom, position: Position, size: number, count: number): void {
            let element = document.createElement("canvas");
            element.id = `bkout_circle_${count}`;
            let ctx = element.getContext("2d");
            let width = this.targetDom.clientWidth;
            let height = this.targetDom.clientHeight;
            element.setAttribute("width", width.toString());
            element.setAttribute("height", height.toString());
            element.style.cssText = `z-index: ${this._player.zIndex + 1}; position: absolute;`;
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,width,height);

            if(size > 0){
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                let charSize = this._player.getCharSize()
                ctx.arc(position.x + charSize.width / 2, height - position.y - charSize.height / 2, size, 0, Math.PI * 2, false);
            }
            ctx.fill();

            targetDom.appendChild(element);
            if (count != 0)
                targetDom.removeChild(document.getElementById(`bkout_circle_${count - 1}`));
        }

        public static checkMobile(): boolean {
            if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
                return true;
            } else {
                return false;
            }
        }


    }   
}