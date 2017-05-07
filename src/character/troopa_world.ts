namespace Charjs {
    export class TroopaWorld extends AbstractEnemy {
        cchars = null;
        chars = [[
            [0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 5, 1, 6, 6, 2, 2, 1, 5, 0, 0, 0, 0],
            [0, 0, 0, 5, 6, 6, 1, 1, 1, 2, 2, 6, 5, 0, 0, 0],
            [0, 0, 5, 6, 6, 1, 7, 7, 7, 7, 1, 6, 6, 5, 0, 0],
            [0, 0, 1, 6, 1, 7, 7, 7, 7, 7, 7, 1, 6, 1, 0, 0],
            [0, 5, 6, 1, 7, 7, 7, 7, 7, 7, 7, 7, 1, 6, 5, 0],
            [0, 5, 1, 6, 1, 7, 7, 7, 7, 7, 7, 1, 6, 1, 5, 0],
            [5, 1, 5, 6, 6, 1, 7, 7, 7, 7, 1, 6, 6, 5, 1, 5],
            [1, 5, 5, 5, 6, 6, 1, 1, 1, 1, 6, 6, 5, 5, 5, 1],
            [2, 2, 2, 5, 5, 1, 0, 0, 0, 0, 1, 5, 5, 2, 2, 2],
            [2, 2, 2, 2, 1, 5, 5, 5, 5, 5, 5, 1, 2, 2, 2, 2],
            [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
            [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0],
            [0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0],
            [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        ], [
            [0, 0, 0, 0, 0, 5, 5, 1, 5, 5, 5, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 5, 5, 2, 2, 1, 6, 5, 5, 0, 0, 0, 0],
            [0, 0, 0, 5, 6, 2, 2, 7, 7, 1, 1, 1, 5, 0, 0, 0],
            [0, 0, 1, 5, 6, 7, 7, 7, 1, 7, 6, 6, 1, 5, 0, 0],
            [0, 0, 5, 1, 7, 7, 7, 1, 7, 7, 7, 6, 6, 1, 0, 0],
            [0, 5, 6, 6, 1, 1, 1, 7, 7, 7, 7, 6, 6, 6, 1, 0],
            [0, 5, 6, 1, 6, 6, 6, 1, 7, 7, 6, 6, 6, 1, 5, 0],
            [5, 5, 1, 2, 2, 2, 2, 2, 1, 6, 6, 6, 1, 6, 5, 5],
            [1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 6, 5, 5, 5],
            [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 1, 5, 5, 0],
            [2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
            [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 0],
            [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
        ], [
            [0, 0, 0, 0, 0, 5, 1, 5, 5, 1, 5, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 5, 1, 2, 2, 6, 6, 1, 5, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 2, 2, 7, 7, 7, 7, 1, 1, 0, 0, 0],
            [0, 0, 5, 5, 6, 1, 7, 7, 7, 7, 1, 6, 5, 5, 0, 0],
            [0, 0, 5, 6, 7, 7, 1, 7, 7, 1, 7, 7, 6, 5, 0, 0],
            [0, 5, 5, 6, 7, 7, 7, 1, 1, 7, 7, 7, 6, 5, 5, 0],
            [0, 5, 5, 6, 6, 7, 1, 7, 7, 1, 7, 6, 6, 5, 5, 0],
            [0, 1, 5, 5, 6, 1, 2, 2, 2, 2, 1, 6, 5, 5, 1, 0],
            [0, 5, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 5, 5],
            [5, 1, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 1, 5],
            [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
            [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [0, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0],
            [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
        ]];

        private static animation = [
            { index: 4, direction: Direction.Right },
            { index: 3, direction: Direction.Left },
            { index: 2, direction: Direction.Right },
            { index: 3, direction: Direction.Right }
        ]

        private animationIndex = 4;
        private _speed = 0;
        private _actionIndex = 0;
        private _star_effect: StarEffect = null;
        private _yVector = 0;
        private _grabbedPlayer: IPlayer = null;


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

        onAction(): void {
            let directionUpdated = this.updateDirection();

            let targetEnemy = this.doHitTestWithOtherEnemy();
            if (targetEnemy) {
                let ePos = targetEnemy.getPosition();
                let targetEnemyCenter = ePos.x + targetEnemy.getCharSize().width / 2;
                let enemyCenter = this.position.x + this.size.width / 2;
                targetEnemy.onEnemyAttack(targetEnemyCenter <= enemyCenter ? Direction.Left : Direction.Right, 10);
                let effectPos: IPosition = { x: (this.position.x + ePos.x) / 2, y: (this.position.y + ePos.y) / 2 };
                this._star_effect.drawEffect(effectPos);
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
            if (this._speed > 0) {
                if (this.animationIndex >= TroopaWorld.animation.length) {
                    this.animationIndex = 0;
                }
                this._actionIndex = TroopaWorld.animation[this.animationIndex].index;
                direction = TroopaWorld.animation[this.animationIndex].direction;
                this.animationIndex++;
            }

            this.draw(this._actionIndex, null, direction, Vertical.Up, true);
        }

        isStepped(): boolean {
            return true;
        }

        onKilled(): void {
            this.destroy();
        }

        onStepped(): void {
        }

        onGrabed(player: IPlayer): void {
            this._grabbedPlayer = player;
        }

        onKicked(kickDirection: Direction, kickPower: number): HitStatus {
            this._speed = 10;
            this._direction = kickDirection;
            return HitStatus.attack;
        }

        onEnemyAttack(attackDirection: Direction, kickPower: number): void {
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