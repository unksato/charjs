/// <reference path="../abstract_character.ts" />

namespace Charjs {
    export abstract class AbstractPlayer extends AbstractCharacter implements IPlayer {
        score: number = 0;

        abstract onPushedUp(player: IPlayer): void;
        abstract onStepped(player: IPlayer): void;

        abstract isSquat(): boolean;
        abstract isJumping(): boolean;

        abstract onGrab(): void;
        abstract onAbortGrab(): void;
        abstract onJump(): void;
        abstract onAbortJump(): void;
        abstract onSpeedUp(): void;
        abstract onAbortSpeedUp(): void;
        abstract onSpecialJump(): void;
        abstract onLookup(): void;
        abstract onAbortLookup(): void;
        abstract onSquat(): void;
        abstract onAbortSquat(): void;
        abstract onLeft(): void;
        abstract onAbortLeft(): void;
        abstract onRight(): void;
        abstract onAbortRight(): void;
        abstract onPause(): void;

        abstract onGool(callback?: Function): void;
        abstract releaseEnemy(): void;

        protected _gameController: IController = null;

        setController(gameController: IController) {
            this._gameController = gameController;
        }

        getScore(): number {
            return this.score;
        }

        addScore(pointIndex: number): void {
            let point = 0;
            switch (pointIndex) {
                case 0:
                    point = 200; break;
                case 1:
                    point = 400; break;
                case 2:
                    point = 800; break;
                case 3:
                    point = 1000; break;
                case 4:
                    point = 2000; break;
                case 5:
                    point = 4000; break;
                case 6:
                    point = 8000; break;
                default:
                // 1UP
            }

            this.score += point;
        }
    }

}