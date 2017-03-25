namespace Character {
    export class Goomba extends AbstractCharacter implements IEnemy {
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

        useVertical = true;
        isEnemy = true;

        private _speed = 1;
        private static STEP = 2;
        private _currentStep = 0;
        private _actionIndex = 0;
        private _isKilled = false;

        private _isStepped = false;

        isKilled(): boolean{
            return this._isKilled;
        }

        onAction(): void {
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

            this.draw(this._actionIndex, null, this._isReverse, this._isStepped, true);
        }

        isStepped(): boolean{
            return this._isStepped;
        }

        onStepped(): void {
            this._isStepped = true;
            this._speed = 0;
        }

        onKicked(direction:number, kickPower: number): void {
            this.stop();
            this._isKilled = true;
            let yVector = 10 * this.pixSize;
            let killTimer = setInterval(() => {

                yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + yVector;
                this.position.x += kickPower * direction;

                if (this.position.y < this.charHeight * 5 * -1) {
                    clearInterval(killTimer);
                    this.destroy();
                    return;
                }

                if (this._currentStep < Goomba.STEP) {
                    this._currentStep++;
                } else {
                    this._currentStep = 0;
                    this._actionIndex = this._actionIndex ^ 1;
                }

                this.draw(this._actionIndex, null, direction > 0 ? false : true, this._isStepped, true);


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
