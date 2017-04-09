namespace Charjs {
    export class GoombaWorld extends AbstractEnemy {
        colors = ['','#000000','#ffffff','#b82800','#f88800','#f87800','#f8c000','#f8f800'];
        cchars = [[[0,16],[0,6,1,4,0,6],[0,4,1,2,3,4,1,2,0,4],[0,3,1,1,4,1,1,4,3,3,1,4],[0,2,1,1,4,1,2,1,4,1,3,1,1,3,3,1,1,3,0,2],[0,1,1,1,3,2,4,1,3,3,2,1,1,3,2,1,3,1,1,1,0,1],[0,1,1,1,3,5,2,3,3,1,2,3,3,1,1,1],[1,1,3,6,2,2,1,1,3,1,1,1,2,2,3,1,1,1],[1,1,3,7,2,2,3,1,2,2,3,2,1,1],[1,1,3,6,4,6,3,2,1,1],[0,1,1,1,3,3,4,2,2,1,1,4,2,1,3,1,1,1,0,1],[0,1,5,3,4,2,1,2,4,4,1,1,4,2,0,1],[5,1,6,2,7,1,5,2,4,7,1,1,4,1,0,1],[1,1,6,2,7,2,2,1,5,1,0,4,1,2,7,1,2,1,1,1],[0,1,1,2,6,1,7,2,5,1,1,4,6,2,1,2,0,1],[0,3,1,4,0,2,1,4,0,3]],[[0,5,1,4,0,6],[0,4,1,2,3,4,1,2,0,4],[0,3,1,1,4,1,3,3,1,3,3,1,1,3,0,1],[0,2,1,1,4,1,2,1,4,1,3,4,1,2,3,1,1,2,0,1],[0,1,1,1,3,2,4,1,3,5,2,1,1,3,2,1,0,1],[0,1,1,1,3,7,2,3,1,1,2,2,0,1],[1,1,3,8,2,2,1,1,3,1,1,1,2,1,1,1],[1,1,3,9,2,2,3,1,2,2,1,1],[1,1,3,8,4,6,1,1],[0,1,1,1,3,5,4,2,2,1,1,5,0,1],[0,1,1,1,3,4,4,2,1,2,4,4,1,1,0,1],[0,2,1,1,3,2,4,8,1,1,0,2],[0,3,1,2,5,5,4,1,1,2,0,3],[0,5,5,1,6,2,7,2,5,1,0,5],[0,5,5,1,6,4,2,1,5,1,0,4],[0,5,1,7,0,4]]];
        chars = null;
/*        chars = [[
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
            ]];*/

        private static DEFAULT_SPEED = 1;
        private _speed = GoombaWorld.DEFAULT_SPEED;
        private static STEP = 2;
        private _step = GoombaWorld.STEP;
        private _currentStep = 0;
        private _actionIndex = 0;
        private _isKilled = false;
        private _yVector = 0;
        private _jumpPower = 12;
        private _isJumping = false;
        private _grabbedPlayer : IPlayer = null;


        private _vertical : Vertical = Vertical.Up;

        constructor(targetDom, pixSize:number, position: IPosition, direction: Direction = Direction.Right, zIndex = 2147483640, frameInterval = 45){
            super(targetDom, pixSize, position, direction, true, true, zIndex-1, frameInterval);
        }

        isKilled(): boolean{
            return this._isKilled;
        }

        private executeJump() : void {
            let ground = this.entity.ground || 0;

            if (this._isJumping) {
                this._yVector -= this._gravity * this.pixSize;
                if(this.entity.ceiling != null){
                    this.position.y = Math.min(this.position.y + this._yVector, this.entity.ceiling - this.size.height + this.size.heightOffset);
                    if(this.position.y == this.entity.ceiling - this.size.height + this.size.heightOffset && this._yVector > 0){
                        this._yVector = 0;
                    }
                }else{
                    this.position.y = this.position.y + this._yVector;
                }

                if (this.position.y <= ground) {
                    this._isJumping = false;
                    this._yVector = 0;
                    this.position.y = ground;
                    this._speed = GoombaWorld.DEFAULT_SPEED;
                } else {
                    if(this._yVector <= 0) {
                        this._vertical = Vertical.Up;
                    };
                }
            }else{
                if(this.position.y > ground){
                    this._yVector-= this._gravity*this.pixSize;
                    this.position.y+=this._yVector;
                    if(this.position.y < ground){
                        this.position.y = ground;
                    }
                }else{
                    this._yVector = 0;
                }
            }
        }

        private _steppedTimeout = 0;
        private _revivedTimeout = 0;

        onAction(): void {
            if(this._steppedTimeout > 0){
                this._steppedTimeout-=this.frameInterval;
                if(this._steppedTimeout <= 0){
                    this._step = 1;
                    this._revivedTimeout = 2000;
                    this._steppedTimeout = 0;
                }
            }
            if(this._revivedTimeout > 0){
                this._revivedTimeout-=this.frameInterval;
                if(this._revivedTimeout <= 0){
                    if(this._grabbedPlayer){
                        this._step = GoombaWorld.STEP;
                        this._vertical = Vertical.Up;
                        if(this._grabbedPlayer){
                            this._grabbedPlayer.releaseEnemy();
                            this._grabbedPlayer = null;
                        }
                    }else{
                        this._step = GoombaWorld.STEP;
                        this._isJumping = true;
                        this._yVector = this._jumpPower * this.pixSize;
                    }  
                }
            }

            if(!this._grabbedPlayer) {
                let directionUpdated = this.updateDirection();

                if (this.doHitTestWithOtherEnemy()) {
                    this._direction = this._direction == Direction.Right ? Direction.Left : Direction.Right;
                }

                this.updateEntity();                

                this.executeJump();

                if (this._direction == Direction.Right) {
                    this.position.x += this.pixSize * this._speed;
                } else {
                    this.position.x -= this.pixSize * this._speed;            
                }

                this.drawAction();
            }
        }

        drawAction(): void {
            if (this._currentStep < this._step) {
                this._currentStep++;
            } else {
                this._currentStep = 0;
                this._actionIndex = this._actionIndex ^ 1;
            }

            this.draw(this._actionIndex, null, this._direction, this._vertical, true);
        }

        isStepped(): boolean{
            return this._vertical == Vertical.Down;
        }


        onStepped(): void {
            this._vertical = Vertical.Down;
            this._speed = 0;
            this._steppedTimeout = 5000;
        }

        onGrabed(player:IPlayer): void {
            this._grabbedPlayer = player;
        }

        onKicked(kickDirection:Direction, kickPower: number): void {
            this.stop();
            this._isKilled = true;
            let yVector = 10 * this.pixSize;
            let direction = kickDirection == Direction.Right ? 1 : -1;

            let killTimer = setInterval(() => {

                yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + yVector;
                this.position.x += kickPower * direction;

                if (this.position.y < this.size.height * 5 * -1) {
                    clearInterval(killTimer);
                    this.destroy();
                    return;
                }

                if (this._currentStep < GoombaWorld.STEP) {
                    this._currentStep++;
                } else {
                    this._currentStep = 0;
                    this._actionIndex = this._actionIndex ^ 1;
                }

                this.draw(this._actionIndex, null, this._direction, Vertical.Down, true);

            }, this.frameInterval);
        }

        private doHitTestWithOtherEnemy(): boolean {
            if (this._gameMaster) {
                let enemys = this._gameMaster.getEnemys();
                for (let name in enemys) {
                    if (enemys[name] != this) {
                        let ePos = enemys[name].getPosition();
                        let eSize = enemys[name].getCharSize()
                        if (this.position.y > ePos.y + eSize.height)
                            continue;
                        if (ePos.y > this.position.y + this.size.height)
                            continue;
                        if (this.position.x > ePos.x + eSize.width)
                            continue;
                        if (ePos.x > this.position.x + this.size.width)
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
