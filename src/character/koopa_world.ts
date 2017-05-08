namespace Charjs {
    export class KoopaWorld extends AbstractEnemy {
        colors = ['', '#000000', '#f8f8f8', '#b52b0f', '#f58820', '#17770f', '#28b61d', '#3af52a'];
        cchars = null;
        chars = [[
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 2, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 2, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 3, 2, 2, 2, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 2, 2, 2, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 2, 2, 2, 2, 0],
            [0, 0, 0, 0, 3, 3, 3, 3, 3, 4, 4, 4, 2, 2, 4, 3],
            [0, 0, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1, 3],
            [0, 3, 2, 2, 2, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 3],
            [0, 3, 2, 2, 4, 4, 2, 4, 3, 4, 4, 3, 4, 4, 4, 3],
            [3, 2, 2, 2, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3, 0],
            [3, 2, 2, 2, 4, 4, 4, 3, 0, 0, 3, 4, 3, 3, 0, 0],
            [0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 3, 3, 0, 0, 0],
            [0, 0, 1, 7, 7, 7, 7, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 7, 7, 7, 7, 2, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
        ], [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 2, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 2, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 3, 2, 2, 2, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 2, 2, 2, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 2, 2, 2, 2, 3],
            [0, 0, 0, 0, 3, 3, 3, 3, 3, 4, 4, 4, 2, 2, 4, 3],
            [0, 0, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1, 3],
            [0, 3, 2, 2, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 3],
            [0, 3, 2, 4, 4, 2, 2, 4, 3, 4, 4, 3, 4, 4, 4, 3],
            [1, 2, 2, 4, 4, 4, 2, 3, 3, 3, 4, 4, 3, 4, 3, 0],
            [1, 3, 2, 4, 4, 4, 1, 1, 1, 2, 3, 4, 3, 3, 0, 0],
            [1, 6, 3, 3, 1, 7, 7, 7, 7, 1, 1, 3, 3, 0, 0, 0],
            [0, 1, 6, 6, 1, 7, 7, 7, 7, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
        ], [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 2, 7, 7, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 7, 7, 7, 7, 7, 1, 0, 0, 0, 0, 2, 2, 0, 0],
            [0, 0, 1, 7, 7, 7, 7, 1, 0, 0, 3, 2, 2, 2, 2, 0],
            [0, 0, 1, 1, 1, 7, 1, 0, 0, 3, 4, 2, 2, 1, 0, 0],
            [0, 3, 4, 4, 4, 1, 1, 0, 3, 4, 4, 2, 2, 2, 1, 0],
            [3, 2, 3, 4, 4, 4, 3, 0, 3, 4, 4, 2, 2, 2, 1, 0],
            [3, 2, 2, 3, 3, 3, 2, 3, 3, 4, 4, 2, 2, 2, 2, 3],
            [3, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 4, 2, 2, 4, 3],
            [3, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 1, 3],
            [0, 3, 2, 2, 2, 3, 4, 4, 3, 4, 4, 4, 4, 4, 4, 3],
            [0, 3, 2, 2, 2, 3, 4, 4, 4, 3, 3, 3, 4, 4, 4, 3],
            [0, 0, 3, 2, 2, 3, 4, 4, 4, 4, 3, 4, 3, 4, 3, 0],
            [0, 0, 0, 3, 3, 2, 3, 3, 4, 4, 4, 3, 4, 3, 0, 0],
            [0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0]
        ], [
            [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 7, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 1, 7, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 7, 7, 1, 0, 0, 0, 0, 2, 2, 0, 0, 0],
            [0, 0, 1, 7, 7, 7, 7, 1, 0, 3, 2, 2, 2, 2, 0, 0],
            [0, 0, 1, 1, 7, 7, 1, 0, 3, 4, 2, 2, 1, 2, 0, 0],
            [0, 3, 4, 4, 1, 1, 0, 3, 4, 4, 2, 2, 2, 1, 0, 0],
            [0, 3, 3, 4, 4, 4, 3, 3, 4, 4, 2, 2, 2, 1, 0, 0],
            [3, 2, 2, 3, 3, 3, 3, 3, 4, 4, 2, 2, 2, 2, 3, 0],
            [3, 2, 2, 2, 2, 2, 3, 4, 4, 4, 4, 2, 2, 4, 3, 0],
            [3, 2, 2, 2, 2, 2, 3, 4, 4, 4, 4, 4, 4, 1, 3, 0],
            [3, 2, 2, 2, 2, 3, 3, 3, 4, 3, 3, 4, 4, 4, 3, 0],
            [3, 3, 2, 2, 2, 3, 4, 4, 3, 4, 4, 3, 4, 4, 3, 0],
            [0, 3, 3, 2, 2, 3, 4, 4, 4, 3, 4, 3, 4, 3, 0, 0],
            [0, 0, 3, 3, 2, 2, 3, 4, 4, 4, 3, 4, 3, 0, 0, 0],
            [0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0]
        ], [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 0],
            [3, 4, 4, 3, 2, 2, 2, 3, 3, 2, 2, 2, 3, 4, 4, 3],
            [3, 3, 3, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 3, 3, 3],
            [0, 0, 3, 4, 2, 2, 2, 4, 4, 2, 2, 2, 4, 3, 0, 0],
            [0, 0, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 0, 0],
            [0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0],
            [0, 1, 2, 7, 7, 7, 1, 2, 2, 1, 7, 7, 7, 2, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 0]
        ]];

        private _yVector = 0;
        private _isKilled = false;
        private static STEP = 2;
        private _step = KoopaWorld.STEP;
        private _currentStep = 0;
        private _actionIndex = 0;
        private _xVector = 0;
        private static DEFAULT_SPEED = 1;
        private _speed = KoopaWorld.DEFAULT_SPEED;
        private _star_effect: StarEffect = null;
        private _vertical = Vertical.Up;

        constructor(targetDom, pixSize: number, position: IPosition, direction: Direction = Direction.Right, zIndex = 100, frameInterval = 45) {
            super(targetDom, pixSize, position, direction, true, true, zIndex - 1, frameInterval);
            this._star_effect = new StarEffect(targetDom, pixSize).init();
        }

        private executeJump(): void {
            let ground = this.entity.ground || 0;

            if (this.position.y > ground) {
                this._yVector -= this._gravity * this.pixSize;
                this.position.y += this._yVector;
                if (this.position.y < ground) {
                    this.position.y = ground;
                }
            } else {
                this._yVector = 0;
            }
        }

        onPushOut(): KoopaWorld {
            this._xVector = 12;
            return this;
        }

        private pikupikuCount = 0;

        onAction(): void {
            let directionUpdated = this.updateDirection();
            let targetEnemy = this.doHitTestWithOtherEnemy();

            this.updateEntity();
            this.executeJump();

            if (this._xVector > 0) {
                this._xVector--;
                this._speed = KoopaWorld.DEFAULT_SPEED * this._xVector;
            } else {
                this._speed = KoopaWorld.DEFAULT_SPEED;
            }

            if (this._xVector == 0 && this.pikupikuCount < 100) {
                this.pikupikuCount++;
                this._speed = 0;
            }

            if (this._direction == Direction.Right) {
                this.position.x += this.pixSize * this._speed;
            } else {
                this.position.x -= this.pixSize * this._speed;
            }

            this.drawAction();
        }


        drawAction() {
            let action = this._actionIndex;

            if (this._xVector > 0) {
                action = 2;
            } else {
                if (this._currentStep < this._step) {
                    this._currentStep++;
                } else {
                    this._currentStep = 0;
                    if (this._actionIndex == 0 || this._actionIndex == 1) {
                        this._actionIndex = this._actionIndex ^ 1;
                    } else {
                        this._actionIndex = 0;
                    }
                }

                if (this._speed == 0) {
                    action = this._actionIndex + 2;
                }

            }

            this.draw(action, null, this._direction, this._vertical, true);
        }

        isKilled(): boolean {
            return this._isKilled;
        }

        onKilled(): void {
            this.destroy();
        }

        isStepped(): boolean {
            return false;
        }

        onStepped(): void {
            this._isKilled = true;
            this.stop();
            this.draw(4, null, this._direction, Vertical.Up, true);
            let timercount = 0;
            let killTimer = this.getTimer(() => {
                timercount++;
                if (timercount > 4) {
                    this.removeTimer(killTimer);
                    this.destroy();
                }
            }, this.frameInterval);
        }

        onGrabed(player: IPlayer): void {
        }

        onKicked(kickDirection: Direction, kickPower: number): HitStatus {
            return HitStatus.none;
        }

        onEnemyAttack(attackDirection: Direction, kickPower: number): void {
            if (this._xVector > 0) return;
            this._isKilled = true;
            this.stop();
            let yVector = 10 * this.pixSize;
            let direction = (attackDirection == Direction.Right ? 1 : -1);

            let killTimer = this.getTimer(() => {

                yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + yVector;
                this.position.x += kickPower * direction;

                if (this.position.y < this.size.height * 5 * -1) {
                    this.removeTimer(killTimer);
                    this.destroy();
                    return;
                }

                this.draw(this._actionIndex, null, this._direction, Vertical.Down, true);

            }, this.frameInterval);
        }

        registerActionCommand(): void {
        }

    }
}