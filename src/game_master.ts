namespace Charjs {

    export class GameMaster {

        static GAME_MASTERS = {};
        private _point = 0;

        constructor(private targetDom: HTMLElement, private charSize: number = 2, private frameInterval = 45, private _goolCallback?: { (name : string, point: number) }, private _gameoverCallback?: { (name : string, point: number) }) {
        }

        public static GetController(gameName: string, targetDom?: HTMLElement, charSize?: number, frameInterval?: number, goolCallback?: { (name : string, point: number) }, gameoverCallback?: { (name : string, point: number) }): GameMaster {
            let master = GameMaster.GAME_MASTERS[gameName];
            if (master) {
                return master;
            }

            if (targetDom) {
                master = new GameMaster(targetDom, charSize, frameInterval, goolCallback, gameoverCallback);
                GameMaster.GAME_MASTERS[gameName] = master;
                return master;
            } else {
                return null;
            }
        }

        private _events: { [id: number]: Function } = {};
        private _eventCount = 0;

        public addEvent(func: Function): number {
            this._eventCount++;
            this._events[this._eventCount] = func;
            return this._eventCount;
        }

        public removeEvent(id: number): void {
            delete this._events[id];
        }

        private _gameTimer = null;

        private startTimer(): void {
            if (!this._gameTimer) {
                this._gameTimer = setInterval(() => {
                    for (let id in this._events) {
                        this._events[id]();
                    }
                }, this.frameInterval);
            }
        }

        private stopTimer(): void {
            if (this._gameTimer) {
                clearInterval(this._gameTimer);
                this._gameTimer = null;
            }
        }

        private _enemys: { [key: string]: IEnemy } = {}
        private _enemyCount = 0;
        private _objects: { [key: string]: IOtherObject } = {}
        private _objectCount = 0;

        private _players: { [key: string]: IPlayer } = {};
        private _playerCount = 0;

        private _isStarting = false;

        public CreatePlayerInstance<C extends AbstractPlayer>(clz: { new (targetDom, pixSize, position, direction, zIndex, frame): C }, position: IPosition, direction = Direction.Right): C {
            let char = new clz(this.targetDom, this.charSize, position, direction, 100, this.frameInterval);
            char._name = 'player' + this._playerCount;
            this._playerCount++;
            this._players[char._name] = <any>char;
            char._gameMaster = this;
            return char;
        }

        public CreateEnemyInstance<C extends AbstractEnemy>(clz: { new (targetDom, pixSize, position, direction, zIndex, frame): C }, position: IPosition, direction = Direction.Right): C {
            let char = new clz(this.targetDom, this.charSize, position, direction, 100, this.frameInterval);
            char._name = 'enemy_' + this._enemyCount;
            this._enemyCount++;
            this._enemys[char._name] = <any>char;
            char._gameMaster = this;
            return char;
        }

        public CreateObjectInstance<C extends AbstractOtherObject>(clz: { new (targetDom, pixSize, position, direction, zIndex, frame): C }, position: IPosition): C {
            let char = new clz(this.targetDom, this.charSize, position, Direction.Right, 90, this.frameInterval);
            char._name = 'obj_' + this._objectCount;
            this._objectCount++;
            this._objects[char._name] = <any>char;
            return char;
        }

        public CreateGround<C extends AbstractGround>(clz: { new (targetDom, pixSize): C }, groundDom: HTMLElement): void {
            let ground = <AbstractGround>new clz(groundDom, this.charSize);
            ground.setBorderImage();
        }

        public deleteEnemy(char: IEnemy) {
            this.cleanEntityEnemiesFromAllObjects(char);
            delete this._enemys[char._name];
            if (Object.keys(this._enemys).length == 0) {
                let goolPlayer = null;
                for(let p in this._players){
                    if (goolPlayer == null){
                        goolPlayer = this._players[p];
                    }else{
                        goolPlayer = goolPlayer.getScore() < this._players[p].getScore() ? this._players[p] : goolPlayer;
                    }
                }

                this.doGool(goolPlayer);
            }
        }

        public getEnemys(): { [name: string]: IEnemy } {
            return this._enemys;
        }

        public getApproachedObjects(target: ICharacter, radius: number): IOtherObject[] {
            let objs = [];
            this.cleanEntityEnemiesFromAllObjects(target);
            for (let name in this._objects) {
                if (this._objects[name].isActive) {
                    let objPos = this._objects[name].getPosition();
                    let charPos = target.getPosition();
                    if (charPos.x - radius < objPos.x && objPos.x < charPos.x + radius &&
                        charPos.y - radius < objPos.y && objPos.y < charPos.y + radius) {
                        objs.push(this._objects[name]);
                    }
                }
            }
            return objs;
        }

        public cleanEntityEnemiesFromAllObjects(target: ICharacter) {
            if (target instanceof AbstractEnemy) {
                for (let name in this._objects) {
                    this._objects[name].entityEnemies.some((v, i, array) => { if (v == target) array.splice(i, 1); return true; });
                }
            }
        }

        public init(): void {
            for (let name in this._players) {
                this._players[name].init(true);
            }
            for (let name in this._enemys) {
                this._enemys[name].init(true);
            }
            for (let name in this._objects) {
                this._objects[name].init(true);
            }

            for (let name in this._enemys) {
                this._enemys[name].start();
            }
            for (let name in this._players) {
                this._players[name].start();
            }

            this.registerCommand();
        }

        public isStarting(): boolean {
            return this._isStarting;
        }

        public registerCommand(): void {
        }

        public start(): void {
            this.startTimer();
            this._isStarting = true;
        }

        public stop(): void {
            this.stopTimer();
            this._isStarting = false;
        }

        public doGameOver(player: IPlayer): void {
            if (this._gameoverCallback) {
                this._gameoverCallback(player._name, player.getScore());
            }

            for (let name in this._enemys) {
                this._enemys[name].stop();
            }
        }

        public doGool(player: IPlayer): void {
            if (this._goolCallback) {
                this._goolCallback(player._name, player.getScore());
            }

            for (let name in this._enemys) {
                this._enemys[name].stop();
            }

            let screen = document.body;

            let blackScreen = document.createElement('div');
            blackScreen.setAttribute("width", screen.clientWidth.toString());
            blackScreen.setAttribute("height", screen.clientHeight.toString());

            let backgroundOpacity = 0;

            let goolDimTimer = this.addEvent(() => {
                if (Math.floor(backgroundOpacity) != 1) {
                    backgroundOpacity += 0.01;
                } else {
                    this.removeEvent(goolDimTimer);
                    player.stop();
                    player.onGool(() => {

                        let goolDimOffTimer = this.addEvent(() => {

                            if (backgroundOpacity.toFixed(2) != "0.20") {
                                backgroundOpacity -= 0.05;
                            } else {
                                this.removeEvent(goolDimOffTimer);
                                player.start();
                                let circleSize = screen.clientWidth > screen.clientHeight ? screen.clientWidth : screen.clientHeight;
                                let circleAnimationCount = 0;
                                let circleTimer = this.addEvent(() => {
                                    circleSize -= 20;
                                    let rect = player.getCurrntElement().getBoundingClientRect();
                                    this.drawBlackClipCircle(screen, rect, circleSize, circleAnimationCount, player.zIndex + 1);
                                    circleAnimationCount++;
                                    if (circleSize <= 0) {
                                        this.removeEvent(circleTimer);
                                        player.destroy();
                                    }
                                });
                            }
                            blackScreen.style.cssText = `z-index: ${player.zIndex - 1}; position: absolute; background-color:black; width: 100vw; height: 100vh; border: 0;opacity: ${backgroundOpacity};`;
                        });
                    });
                }
                blackScreen.style.cssText = `z-index: ${player.zIndex - 1}; position: absolute; background-color:black; width: 100vw; height: 100vh; border: 0;opacity: ${backgroundOpacity};`;
            });

            this.targetDom.appendChild(blackScreen);
        }

        private drawBlackClipCircle(targetDom: HTMLElement, rect: ClientRect, size: number, count: number, zIndex: number): void {
            let element = document.createElement("canvas");
            let ctx = element.getContext("2d");
            let width = targetDom.scrollWidth;
            let height = targetDom.scrollHeight;
            element.id = `bkout_circle_${count}`;
            element.setAttribute("width", width.toString());
            element.setAttribute("height", height.toString());
            element.style.cssText = `z-index: ${zIndex}; position: absolute;`;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            if (size > 0) {
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.arc(rect.left + rect.width / 2 + window.scrollX, rect.top + rect.height / 2 + window.scrollY, size, 0, Math.PI * 2, false);
            }
            ctx.fill();

            targetDom.appendChild(element);
            if (count != 0)
                targetDom.removeChild(document.getElementById(`bkout_circle_${count - 1}`));
        }
    }
}