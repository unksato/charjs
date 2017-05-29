/// <reference path="abstract_object.ts" />

namespace Charjs {
    export abstract class AbstractCharacter extends AbstractObject implements ICharacter {
        abstract onAction(): void;
        abstract registerActionCommand(): void;

        private _isStarting = false;
        private _frameTimer: number = null;
        protected _gravity = 2;

        public registerCommand(): void {
            if (!this._gameMaster) {
                document.addEventListener('keypress', this.defaultCommand);
            }
            this.registerActionCommand();
        }

        defaultCommand = (e: KeyboardEvent) => {
            if (e.keyCode == 32) {
                if (this._isStarting) {
                    this.stop();
                } else {
                    this.start();
                }
            }
        }

        public init(shadow: boolean = false) {
            super.init(shadow);
            this.registerCommand();
            return this;
        }

        public start(): void {
            if (!this._frameTimer) {
                this._frameTimer = this.getTimer(() => { this.onAction() }, this.frameInterval);
            }
            this._isStarting = true;
        }

        public stop(): void {
            if (this._frameTimer) {
                this.removeTimer(this._frameTimer);
                this._frameTimer = null;
            }
            this._isStarting = false;
        }

        public destroy(): void {
            this.stop();
            if (this._gameMaster && this instanceof AbstractEnemy) {
                this._gameMaster.deleteEnemy(<any>this);
            }
            if (!this._gameMaster) {
                document.removeEventListener('keypress', this.defaultCommand);
            }
            super.destroy();
        }

        protected upperObject: IObject = null;
        protected underObject: IObject = null;
        protected rightObject: IObject = null;
        protected leftObject: IObject = null;

        protected updateEntity(): void {
            if (this._gameMaster) {
                let objs = this._gameMaster.getApproachedObjects(this, this.size.width * 3);
                this.entity.ground = null;
                this.entity.ceiling = null;
                this.entity.right = null;
                this.entity.left = null;
                this.upperObject = null;
                this.underObject = null;
                this.rightObject = null;
                this.leftObject = null;
                for (let obj of objs) {
                    let oPos = obj.getPosition();
                    let oSize = obj.getCharSize();

                    let oPosLeft = oPos.x + oSize.widthOffset;
                    let oPosRight = oPos.x + oSize.width - oSize.widthOffset;
                    let oPosUnder = oPos.y;
                    let oPosUpper = oPos.y + oSize.height - oSize.heightOffset;

                    let cPosLeft = this.position.x + this.size.widthOffset;
                    let cPosRight = this.position.x + this.size.width - this.size.widthOffset;
                    let cPosUnder = this.position.y;
                    let cPosUpper = this.position.y + this.size.height - this.size.heightOffset;

                    if (cPosLeft >= oPosLeft && cPosLeft <= oPosRight || cPosRight >= oPosLeft && cPosRight <= oPosRight) {
                        // ground update
                        if (cPosUnder >= oPosUpper && (this.entity.ground === null || this.entity.ground <= oPosUpper)) {
                            this.underObject = obj;
                            if (obj instanceof AbstractOtherObject) {
                                if (cPosUnder == oPosUpper && this instanceof AbstractEnemy && obj.entityEnemies.indexOf(this) == -1)
                                    obj.entityEnemies.push(this);
                            }
                            this.entity.ground = oPosUpper;
                            continue;
                        }
                        // ceiling update
                        if (cPosUpper <= oPosUnder + /*Magic number*/this.pixSize * 3 && (this.entity.ceiling === null || this.entity.ceiling >= oPosUnder + /*Magic number*/this.pixSize * 3)) {
                            this.upperObject = obj;
                            this.entity.ceiling = oPosUnder + /*Magic number*/this.pixSize * 3;
                            continue;
                        }
                    }

                    if (cPosUnder >= oPosUnder && cPosUnder < oPosUpper || cPosUpper > oPosUnder && cPosUpper <= oPosUpper) {
                        // left update
                        if (cPosLeft >= oPosRight && (this.entity.left === null || this.entity.left < oPosRight)) {
                            this.leftObject = obj;
                            this.entity.left = oPosRight;
                            continue;
                        }
                        // right update
                        if (cPosRight <= oPosLeft && (this.entity.right === null || this.entity.right > oPosLeft)) {
                            this.rightObject = obj;
                            this.entity.right = oPosLeft;
                            continue;
                        }
                    }

                }
            }
        }

        protected updateDirection(): boolean {
            let currentDirection = this._direction;
            let right = this.entity.right || this.targetDom.clientWidth;
            let left = this.entity.left || 0;

            if (this.position.x + this.size.width >= right && currentDirection == Direction.Right) {
                this._direction = Direction.Left;
            }
            if (this.position.x <= left && currentDirection == Direction.Left) {
                this._direction = Direction.Right;
            }

            return currentDirection != this._direction;
        }
    }
}