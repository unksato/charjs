namespace Charjs {
    export class KoopatroopaWorld extends AbstractEnemy {
        colors = ['', '#000000', '#f8f8f8', '#b52b0f', '#f58820', '#17770f', '#28b61d', '#3af52a'];
        // cchars = [[[0, 16], [0, 6, 1, 4, 0, 6], [0, 4, 1, 2, 3, 4, 1, 2, 0, 4], [0, 3, 1, 1, 4, 1, 1, 4, 3, 3, 1, 4], [0, 2, 1, 1, 4, 1, 2, 1, 4, 1, 3, 1, 1, 3, 3, 1, 1, 3, 0, 2], [0, 1, 1, 1, 3, 2, 4, 1, 3, 3, 2, 1, 1, 3, 2, 1, 3, 1, 1, 1, 0, 1], [0, 1, 1, 1, 3, 5, 2, 3, 3, 1, 2, 3, 3, 1, 1, 1], [1, 1, 3, 6, 2, 2, 1, 1, 3, 1, 1, 1, 2, 2, 3, 1, 1, 1], [1, 1, 3, 7, 2, 2, 3, 1, 2, 2, 3, 2, 1, 1], [1, 1, 3, 6, 4, 6, 3, 2, 1, 1], [0, 1, 1, 1, 3, 3, 4, 2, 2, 1, 1, 4, 2, 1, 3, 1, 1, 1, 0, 1], [0, 1, 5, 3, 4, 2, 1, 2, 4, 4, 1, 1, 4, 2, 0, 1], [5, 1, 6, 2, 7, 1, 5, 2, 4, 7, 1, 1, 4, 1, 0, 1], [1, 1, 6, 2, 7, 2, 2, 1, 5, 1, 4, 4, 1, 2, 7, 1, 2, 1, 1, 1], [0, 1, 1, 2, 6, 1, 7, 2, 5, 1, 1, 4, 6, 2, 1, 2, 0, 1], [0, 3, 1, 4, 0, 2, 1, 4, 0, 3]], [[0, 6, 1, 4, 0, 6], [0, 4, 1, 2, 3, 4, 1, 2, 0, 4], [0, 3, 1, 1, 4, 1, 3, 3, 1, 3, 3, 1, 1, 3, 0, 1], [0, 2, 1, 1, 4, 1, 2, 1, 4, 1, 3, 4, 1, 2, 3, 1, 1, 2, 0, 1], [0, 1, 1, 1, 3, 2, 4, 1, 3, 5, 2, 1, 1, 3, 2, 1, 0, 1], [0, 1, 1, 1, 3, 7, 2, 3, 1, 1, 2, 2, 0, 1], [1, 1, 3, 8, 2, 2, 1, 1, 3, 1, 1, 1, 2, 1, 1, 1], [1, 1, 3, 9, 2, 2, 3, 1, 2, 2, 1, 1], [1, 1, 3, 8, 4, 6, 1, 1], [0, 1, 1, 1, 3, 5, 4, 2, 2, 1, 1, 5, 0, 1], [0, 1, 1, 1, 3, 4, 4, 2, 1, 2, 4, 4, 1, 1, 0, 1], [0, 2, 1, 1, 3, 2, 4, 8, 1, 1, 0, 2], [0, 3, 1, 2, 5, 5, 4, 1, 1, 2, 0, 3], [0, 5, 5, 1, 6, 2, 7, 2, 5, 1, 0, 5], [0, 5, 5, 1, 6, 4, 2, 1, 5, 1, 0, 4], [0, 5, 1, 7, 0, 4]]]
        // chars = null;
        cchars = null;
        chars = [[
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 2, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3, 4, 2, 2, 2, 1, 3, 0, 0],
            [0, 0, 0, 0, 0, 0, 3, 4, 4, 2, 2, 2, 2, 4, 3, 0],
            [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 2, 2, 4, 4, 3, 0],
            [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3],
            [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3],
            [0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 3, 3, 4, 4, 3],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 3, 4, 3],
            [0, 0, 0, 0, 1, 5, 5, 1, 0, 3, 4, 4, 4, 4, 3, 3],
            [0, 0, 5, 5, 1, 2, 2, 5, 1, 1, 4, 4, 3, 3, 3, 0],
            [0, 5, 7, 1, 7, 7, 1, 2, 1, 2, 1, 4, 3, 0, 0, 0],
            [0, 1, 1, 7, 7, 6, 1, 1, 1, 2, 1, 3, 0, 0, 0, 0],
            [5, 6, 1, 6, 6, 1, 6, 1, 3, 3, 1, 1, 1, 0, 0, 0],
            [5, 6, 1, 1, 1, 6, 5, 3, 4, 4, 3, 2, 2, 1, 0, 0],
            [5, 1, 6, 6, 1, 1, 2, 3, 4, 3, 6, 6, 1, 0, 0, 0],
            [1, 6, 6, 5, 1, 2, 1, 3, 4, 3, 3, 1, 0, 0, 0, 0],
            [5, 5, 5, 1, 1, 3, 3, 3, 4, 4, 4, 3, 0, 0, 0, 0],
            [2, 1, 1, 1, 2, 3, 4, 3, 4, 4, 4, 3, 0, 0, 0, 0],
            [1, 2, 2, 2, 1, 3, 4, 4, 3, 3, 3, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 7, 7, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 7, 7, 7, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 7, 7, 7, 7, 2, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        ], [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 2, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3, 4, 2, 2, 2, 1, 3, 0, 0],
            [0, 0, 0, 0, 0, 0, 3, 4, 4, 2, 2, 2, 2, 4, 3, 0],
            [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 2, 2, 4, 4, 3, 0],
            [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3],
            [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3],
            [0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 3, 3, 4, 4, 3],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 3, 4, 3],
            [0, 0, 0, 0, 1, 5, 5, 1, 0, 3, 4, 4, 4, 4, 3, 3],
            [0, 0, 5, 5, 1, 2, 2, 5, 1, 1, 4, 4, 3, 3, 3, 0],
            [0, 5, 7, 3, 3, 3, 3, 3, 1, 2, 1, 4, 3, 0, 0, 0],
            [5, 6, 3, 4, 4, 4, 4, 4, 3, 2, 1, 3, 0, 3, 3, 0],
            [5, 6, 3, 4, 4, 3, 3, 4, 4, 3, 1, 1, 1, 4, 4, 3],
            [5, 6, 3, 4, 4, 3, 1, 3, 3, 5, 2, 2, 2, 1, 4, 3],
            [5, 1, 6, 3, 3, 1, 2, 1, 2, 2, 6, 6, 1, 3, 3, 0],
            [1, 6, 6, 5, 1, 2, 1, 2, 5, 2, 2, 1, 0, 0, 0, 0],
            [5, 5, 1, 5, 3, 3, 3, 2, 2, 6, 6, 1, 1, 1, 0, 0],
            [0, 1, 7, 1, 4, 4, 3, 6, 2, 2, 1, 1, 2, 1, 0, 0],
            [1, 7, 7, 7, 1, 4, 3, 2, 1, 1, 1, 7, 7, 1, 0, 0],
            [1, 7, 7, 7, 7, 1, 1, 1, 1, 7, 7, 7, 7, 1, 0, 0],
            [0, 1, 7, 7, 1, 1, 0, 0, 1, 7, 7, 7, 1, 0, 0, 0],
            [0, 0, 1, 7, 7, 2, 1, 0, 0, 1, 7, 7, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0]
        ]];

        private static DEFAULT_SPEED = 1;
        private _speed = KoopatroopaWorld.DEFAULT_SPEED;
        private static STEP = 2;
        private _step = KoopatroopaWorld.STEP;
        private _currentStep = 0;
        private _actionIndex = 0;
        private _isKilled = false;
        private _yVector = 0;
        private _isRevivalJumping = false;
        private _star_effect: StarEffect = null;
        private _vertical: Vertical = Vertical.Up;

        constructor(targetDom, pixSize: number, position: IPosition, direction: Direction = Direction.Right, zIndex = 100, frameInterval = 45) {
            super(targetDom, pixSize, position, direction, true, true, zIndex - 1, frameInterval);
            this._star_effect = new StarEffect(targetDom, pixSize).init();
        }

        isKilled(): boolean {
            return this._isKilled;
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

        onAction(): void {
            let directionUpdated = this.updateDirection();

            let targetEnemy = this.doHitTestWithOtherEnemy();
            if (targetEnemy) {
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


        drawAction(): void {
            let direction = this._direction;

            if (this._currentStep < this._step) {
                this._currentStep++;
            } else {
                this._currentStep = 0;
                this._actionIndex = this._actionIndex ^ 1;
            }

            this.draw(this._actionIndex, null, direction, this._vertical, true);
        }

        isStepped(): boolean {
            return false;
        }

        onKilled(): void {
            this._isKilled = true;
            this.destroy();
        }

        onStepped(): void {
            if(this._gameMaster){
                this._isKilled = true;
                let troopa = this._gameMaster.CreateEnemyInstance(TroopaWorld, this.position, this._direction);
                troopa.init().start();
                this.destroy();
            }
        }

        onGrabed(player: IPlayer): void {
        }

        onKicked(kickDirection: Direction, kickPower: number): HitStatus {
            // if (this._isKickBound) {
            //     this._isKickBound = false;
            //     this._speed = 0;
            // } else {
            //     this._isKickBound = true;
            //     this._speed = 10;
            //     this._direction = kickDirection;
            // }

            return HitStatus.none;
        }

        onEnemyAttack(attackDirection: Direction, kickPower: number): void {
            this.stop();
            this._isKilled = true;
            let yVector = 10 * this.pixSize;
            let direction = attackDirection == Direction.Right ? 1 : -1;

            let killTimer = this.getTimer(() => {

                yVector -= this._gravity * this.pixSize;
                this.position.y = this.position.y + yVector;
                this.position.x += kickPower * direction;

                if (this.position.y < this.size.height * 5 * -1) {
                    this.removeTimer(killTimer);
                    this.destroy();
                    return;
                }

                if (this._currentStep < KoopatroopaWorld.STEP) {
                    this._currentStep++;
                } else {
                    this._currentStep = 0;
                    this._actionIndex = this._actionIndex ^ 1;
                }

                this.draw(this._actionIndex, null, this._direction, Vertical.Down, true);

            }, this.frameInterval);
        }

        registerActionCommand(): void {
        }
    }
}
