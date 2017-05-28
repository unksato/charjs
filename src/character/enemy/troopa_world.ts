namespace Charjs {
    export class TroopaWorld extends AbstractEnemy {
        colors = ['', '#000000', '#f8f8f8', '#b52b0f', '#f58820', '#17770f', '#28b61d', '#3af52a'];
        cchars = [[[0, 5, 5, 6, 0, 5], [0, 4, 5, 1, 1, 1, 6, 2, 2, 2, 1, 1, 5, 1, 0, 4], [0, 3, 5, 1, 6, 2, 1, 3, 2, 2, 6, 1, 5, 1, 0, 3], [0, 2, 5, 1, 6, 2, 1, 1, 7, 4, 1, 1, 6, 2, 5, 1, 0, 2], [0, 2, 1, 1, 6, 1, 1, 1, 7, 6, 1, 1, 6, 1, 1, 1, 0, 2], [0, 1, 5, 1, 6, 1, 1, 1, 7, 8, 1, 1, 6, 1, 5, 1, 0, 1], [0, 1, 5, 1, 1, 1, 6, 1, 1, 1, 7, 6, 1, 1, 6, 1, 1, 1, 5, 1, 0, 1], [5, 1, 1, 1, 5, 1, 6, 2, 1, 1, 7, 4, 1, 1, 6, 2, 5, 1, 1, 1, 5, 1], [1, 1, 5, 3, 6, 2, 1, 4, 6, 2, 5, 3, 1, 1], [2, 3, 5, 2, 1, 1, 0, 4, 1, 1, 5, 2, 2, 3], [2, 4, 1, 1, 5, 6, 1, 1, 2, 4], [1, 2, 2, 12, 1, 2], [0, 1, 1, 3, 2, 8, 1, 3, 0, 1], [0, 2, 1, 1, 2, 1, 1, 8, 2, 1, 1, 1, 0, 2], [0, 3, 1, 1, 2, 8, 1, 1, 0, 3], [0, 4, 1, 8, 0, 4]], [[0, 5, 5, 2, 1, 1, 5, 3, 0, 5], [0, 4, 5, 2, 2, 2, 1, 1, 6, 1, 5, 2, 0, 4], [0, 3, 5, 1, 6, 1, 2, 2, 7, 2, 1, 3, 5, 1, 0, 3], [0, 2, 1, 1, 5, 1, 6, 1, 7, 3, 1, 1, 7, 1, 6, 2, 1, 1, 5, 1, 0, 2], [0, 2, 5, 1, 1, 1, 7, 3, 1, 1, 7, 3, 6, 2, 1, 1, 0, 2], [0, 1, 5, 1, 6, 2, 1, 3, 7, 4, 6, 3, 1, 1, 0, 1], [0, 1, 5, 1, 6, 1, 1, 1, 6, 3, 1, 1, 7, 2, 6, 3, 1, 1, 5, 1, 0, 1], [5, 2, 1, 1, 2, 5, 1, 1, 6, 3, 1, 1, 6, 1, 5, 2], [1, 2, 2, 7, 1, 3, 6, 1, 5, 3], [5, 1, 2, 10, 5, 1, 1, 1, 5, 2, 0, 1], [2, 2, 1, 6, 2, 8], [2, 1, 1, 9, 2, 6], [0, 1, 2, 1, 1, 14], [0, 1, 1, 1, 2, 1, 1, 6, 2, 6, 0, 1], [0, 2, 1, 1, 2, 8, 1, 3, 0, 2], [0, 3, 1, 8, 0, 5]], [[0, 5, 5, 1, 1, 1, 5, 2, 1, 1, 5, 1, 0, 5], [0, 4, 5, 1, 1, 1, 2, 2, 6, 2, 1, 1, 5, 1, 0, 4], [0, 3, 1, 2, 2, 2, 7, 4, 1, 2, 0, 3], [0, 2, 5, 2, 6, 1, 1, 1, 7, 4, 1, 1, 6, 1, 5, 2, 0, 2], [0, 2, 5, 1, 6, 1, 7, 2, 1, 1, 7, 2, 1, 1, 7, 2, 6, 1, 5, 1, 0, 2], [0, 1, 5, 2, 6, 1, 7, 3, 1, 2, 7, 3, 6, 1, 5, 2, 0, 1], [0, 1, 5, 2, 6, 2, 7, 1, 1, 1, 7, 2, 1, 1, 7, 1, 6, 2, 5, 2, 0, 1], [0, 1, 1, 1, 5, 2, 6, 1, 1, 1, 2, 4, 1, 1, 6, 1, 5, 2, 1, 1, 0, 1], [0, 1, 5, 1, 1, 3, 2, 6, 1, 3, 5, 2], [5, 1, 1, 1, 5, 1, 2, 10, 5, 1, 1, 1, 5, 1], [1, 1, 2, 4, 1, 6, 2, 4, 1, 1], [2, 4, 1, 8, 2, 4], [2, 1, 1, 14, 2, 1], [0, 1, 1, 1, 2, 2, 1, 8, 2, 2, 1, 1, 0, 1], [0, 2, 1, 2, 2, 8, 1, 2, 0, 2], [0, 4, 1, 8, 0, 4]]];
        chars = null;
        // cchars = null;
        // chars = [[
        //     [0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 5, 1, 6, 6, 2, 2, 1, 5, 0, 0, 0, 0],
        //     [0, 0, 0, 5, 6, 6, 1, 1, 1, 2, 2, 6, 5, 0, 0, 0],
        //     [0, 0, 5, 6, 6, 1, 7, 7, 7, 7, 1, 6, 6, 5, 0, 0],
        //     [0, 0, 1, 6, 1, 7, 7, 7, 7, 7, 7, 1, 6, 1, 0, 0],
        //     [0, 5, 6, 1, 7, 7, 7, 7, 7, 7, 7, 7, 1, 6, 5, 0],
        //     [0, 5, 1, 6, 1, 7, 7, 7, 7, 7, 7, 1, 6, 1, 5, 0],
        //     [5, 1, 5, 6, 6, 1, 7, 7, 7, 7, 1, 6, 6, 5, 1, 5],
        //     [1, 5, 5, 5, 6, 6, 1, 1, 1, 1, 6, 6, 5, 5, 5, 1],
        //     [2, 2, 2, 5, 5, 1, 0, 0, 0, 0, 1, 5, 5, 2, 2, 2],
        //     [2, 2, 2, 2, 1, 5, 5, 5, 5, 5, 5, 1, 2, 2, 2, 2],
        //     [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
        //     [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0],
        //     [0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0],
        //     [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
        //     [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        // ], [
        //     [0, 0, 0, 0, 0, 5, 5, 1, 5, 5, 5, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 5, 5, 2, 2, 1, 6, 5, 5, 0, 0, 0, 0],
        //     [0, 0, 0, 5, 6, 2, 2, 7, 7, 1, 1, 1, 5, 0, 0, 0],
        //     [0, 0, 1, 5, 6, 7, 7, 7, 1, 7, 6, 6, 1, 5, 0, 0],
        //     [0, 0, 5, 1, 7, 7, 7, 1, 7, 7, 7, 6, 6, 1, 0, 0],
        //     [0, 5, 6, 6, 1, 1, 1, 7, 7, 7, 7, 6, 6, 6, 1, 0],
        //     [0, 5, 6, 1, 6, 6, 6, 1, 7, 7, 6, 6, 6, 1, 5, 0],
        //     [5, 5, 1, 2, 2, 2, 2, 2, 1, 6, 6, 6, 1, 6, 5, 5],
        //     [1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 6, 5, 5, 5],
        //     [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 1, 5, 5, 0],
        //     [2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
        //     [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
        //     [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 0],
        //     [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0],
        //     [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
        // ], [
        //     [0, 0, 0, 0, 0, 5, 1, 5, 5, 1, 5, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 5, 1, 2, 2, 6, 6, 1, 5, 0, 0, 0, 0],
        //     [0, 0, 0, 1, 1, 2, 2, 7, 7, 7, 7, 1, 1, 0, 0, 0],
        //     [0, 0, 5, 5, 6, 1, 7, 7, 7, 7, 1, 6, 5, 5, 0, 0],
        //     [0, 0, 5, 6, 7, 7, 1, 7, 7, 1, 7, 7, 6, 5, 0, 0],
        //     [0, 5, 5, 6, 7, 7, 7, 1, 1, 7, 7, 7, 6, 5, 5, 0],
        //     [0, 5, 5, 6, 6, 7, 1, 7, 7, 1, 7, 6, 6, 5, 5, 0],
        //     [0, 1, 5, 5, 6, 1, 2, 2, 2, 2, 1, 6, 5, 5, 1, 0],
        //     [0, 5, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 5, 5],
        //     [5, 1, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 1, 5],
        //     [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
        //     [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
        //     [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        //     [0, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0],
        //     [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0],
        //     [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        // ]];

        private animation = [
            { index: 2, direction: Direction.Right },
            { index: 1, direction: Direction.Left },
            { index: 0, direction: Direction.Right },
            { index: 1, direction: Direction.Right }
        ]

        private animationIndex = 4;
        private _speed = 0;
        private _actionIndex = 0;
        private _yVector = 0;
        private _grabbedPlayer: IPlayer = null;
        private _targetPlayer: IPlayer = null;
        private _isStepped = true;
        private _point: number = 0;

        constructor(targetDom, pixSize: number, position: IPosition, direction: Direction = Direction.Right, zIndex = 100, frameInterval = 45) {
            super(targetDom, pixSize, position, direction, true, true, zIndex - 1, frameInterval);
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
            if (!this._grabbedPlayer) {
                let directionUpdated = this.updateDirection();

                let targetEnemy = this.doHitTestWithOtherEnemy();
                if (targetEnemy && this._speed > 0 && targetEnemy.isActive()) {
                    let ePos = targetEnemy.getPosition();
                    let targetEnemyCenter = ePos.x + targetEnemy.getCharSize().width / 2;
                    let enemyCenter = this.position.x + this.size.width / 2;
                    targetEnemy.onEnemyAttack(targetEnemyCenter <= enemyCenter ? Direction.Left : Direction.Right, 10);
                    PointEffect.drawPoint(this.targetDom, targetEnemy.getPosition(), this._point, this.pixSize);
                    if (this._targetPlayer) {
                        this._targetPlayer.addScore(this._point);
                    }
                    this._point++;
                    let effectPos: IPosition = { x: (this.position.x + ePos.x) / 2, y: (this.position.y + ePos.y) / 2 };
                    StarEffect.drawStar(this.targetDom, effectPos, this.pixSize);
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
            let direction = this._direction;
            if (this._speed > 0) {
                if (this.animationIndex >= this.animation.length) {
                    this.animationIndex = 0;
                }
                this._actionIndex = this.animation[this.animationIndex].index;
                direction = this.animation[this.animationIndex].direction;
                this.animationIndex++;
            }

            this.draw(this._actionIndex, null, direction, Vertical.Up, true);
        }

        isStepped(): boolean {
            return this._isStepped;
        }

        onKilled(): void {
            this.destroy();
        }

        onStepped(): void {
            this._isStepped = true;
            this._speed = 0;
            this._point = 0;
        }

        onGrabed(player: IPlayer): void {
            this._grabbedPlayer = player;
        }

        onKicked(kickDirection: Direction, kickPower: number, player?: IPlayer): HitStatus {
            this._isStepped = false;
            this._speed = 10;
            this._direction = kickDirection;
            this._targetPlayer = player;
            return HitStatus.attack;
        }

        onEnemyAttack(attackDirection: Direction, kickPower: number): void {
            this._isActive = false;
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