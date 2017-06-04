namespace Charjs {
    export enum Direction {
        Right,
        Left
    }

    export enum Vertical {
        Up,
        Down
    }

    export enum HitStatus {
        none,
        dammage,
        attack,
        grab
    }

    export interface IPosition {
        x: number;
        y: number;
    }

    export interface ISize {
        width: number;
        height: number;
        widthOffset: number;
        heightOffset: number;
    }

    export interface IController {
        init(player: IPlayer, options?: any): IController;
        destroyCommand(): void;
        registerCommand(): void;
    }

    export class Entity {
        public ground: number = null;
        public ceiling: number = null;
        public right: number = null;
        public left: number = null;
    }

    export interface IObject {
        _name: string;
        zIndex: number;
        init(shadow?: boolean): void;
        destroy(): void;
        getPosition(): IPosition;
        setPosition(position: IPosition): void;
        getCharSize(): ISize;
        getCurrntElement(): HTMLCanvasElement;
        getDirection(): Direction;

        onPushedUp(player: IPlayer): void;
        onStepped(player: IPlayer, direction?: Direction): void;

        isActive(): boolean;
    }

    export interface ICharacter extends IObject {
        start(): void;
        stop(): void;
        onAction(): void;
    }

    export interface IOperatePlayer {
        setController(gameController: IController): void;

        onGrab(): void;
        onAbortGrab(): void;
        onJump(): void;
        onAbortJump(): void;
        onSpeedUp(): void;
        onAbortSpeedUp(): void;
        onSpecialJump(): void;
        onLookup(): void;
        onAbortLookup(): void;
        onSquat(): void;
        onAbortSquat(): void;
        onLeft(): void;
        onAbortLeft(): void;
        onRight(): void;
        onAbortRight(): void;
        onPause(): void;
    }

    export interface IPlayer extends ICharacter, IOperatePlayer {
        onGool(callback?: Function): void;
        releaseEnemy(): void;
        addScore(pointIndex: number): void;
        getScore(): number;

        isSquat(): boolean;
        isJumping(): boolean;

    }

    export interface IEnemy extends ICharacter {
        onGrabed(player: IPlayer): void;
        onKicked(direction: Direction, kickPower: number, player?: IPlayer): HitStatus;
        onKilled(player?: IPlayer): void;
        onEnemyAttack(attackDirection: Direction, kickPower: number): void;
        //        isKilled(): boolean;
        isStepped(): boolean;
        drawAction(): void;
    }
}