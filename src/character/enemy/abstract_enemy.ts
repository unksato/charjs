namespace Charjs {
    export abstract class AbstractEnemy extends AbstractCharacter implements IEnemy {
        abstract onStepped(player: IPlayer, direction?: Direction): void;
        abstract onGrabed(player: IPlayer): void;
        abstract onKicked(direction: number, kickPower: number, player?: IPlayer): HitStatus;
        abstract isStepped(): boolean;
        abstract drawAction(): void;
        abstract onKilled(player?: IPlayer): void;
        abstract onEnemyAttack(attackDirection: Direction, kickPower: number): void;

        onPushedUp(player?: IPlayer): void {
            let ePos = this.getPosition();
            let effectPos: IPosition = { x: (this.position.x + ePos.x) / 2, y: (this.position.y + ePos.y) / 2 };
            StarEffect.drawStar(this.targetDom, effectPos, this.pixSize);
            PointEffect.drawPoint(this.targetDom, ePos, 0, this.pixSize);
            if (player) {
                player.addScore(0);
            }
            this.onEnemyAttack(Direction.Right, 0);
        }

        protected doHitTestWithOtherEnemy(): IEnemy {
            if (this._gameMaster) {
                let enemys = this._gameMaster.getEnemys();
                for (let name in enemys) {
                    if (enemys[name] != this && enemys[name].isActive()) {
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
                        return enemys[name];
                    }
                }
            }
            return null;
        }
    }

}