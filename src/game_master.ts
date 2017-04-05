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

        public CreateGround<C extends AbstractGround>(clz: { new (targetDom, pixSize): C }, groundDom:HTMLElement) : void {
            let ground = <AbstractGround>new clz(groundDom, this.charSize);
            ground.setBorderImage();
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
            blackScreen.setAttribute("width", screen.clientWidth.toString());
            blackScreen.setAttribute("height", screen.clientHeight.toString());

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
                                backgroundOpacity -= 0.05;
                            } else {
                                clearInterval(goolDimOffTimer);

                                this._player.start();

                                let circleSize =  screen.clientWidth > screen.clientHeight ? screen.clientWidth : screen.clientHeight;
                                let circleAnimationCount = 0;
                                let circleTimer = setInterval(() => {
                                    circleSize-=20;
                                    let rect = this._player.getCurrntElement().getBoundingClientRect();
                                    this.drawBlackClipCircle(screen, rect, circleSize, circleAnimationCount);
                                    circleAnimationCount++;
                                    if(circleSize <= 0){
                                        clearInterval(circleTimer);
                                        this._player.destroy();
                                    }
                                }, this.frameInterval / 2);
                            }
                            blackScreen.style.cssText = `z-index: ${this._player.zIndex - 1}; position: absolute; background-color:black; width: 100vw; height: 100vh; border: 0;opacity: ${backgroundOpacity};`;

                        }, this.frameInterval);
                    });
                }
                blackScreen.style.cssText = `z-index: ${this._player.zIndex - 1}; position: absolute; background-color:black; width: 100vw; height: 100vh; border: 0;opacity: ${backgroundOpacity};`;
            }, this.frameInterval * 1.5);  

            this.targetDom.appendChild(blackScreen);
        }

        private drawBlackClipCircle(targetDom, rect: ClientRect, size: number, count: number): void {
            let element = document.createElement("canvas");
            let ctx = element.getContext("2d");
            let width = targetDom.clientWidth;
            let height = targetDom.clientHeight;
            element.id = `bkout_circle_${count}`;
            element.setAttribute("width",width);
            element.setAttribute("height",height);
            element.style.cssText = `z-index: ${this._player.zIndex + 1}; position: absolute;`;
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,width,height);

            if(size > 0){
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.arc(rect.left + rect.width / 2 , rect.top + rect.height / 2 , size, 0, Math.PI * 2, false);
            }
            ctx.fill();

            this.targetDom.appendChild(element);
            if (count != 0)
                this.targetDom.removeChild(document.getElementById(`bkout_circle_${count - 1}`));
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