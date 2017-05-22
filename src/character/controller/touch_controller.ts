

namespace Charjs {

    export class TouchController implements IController {

        private _canSpeedUpForMobile: boolean = true;
        private _screenModeForMobile: string = 'PORTRAIT';
        private _deviceDirection: number = 1;
        private _player: IPlayer = null;

        init(player: IPlayer): IController {
            this._player = player;
            return this;
        }

        private touch(touchLength: number) {
            switch (touchLength) {
                case 1:
                    this._player.onGrab();
                    break;
                case 2:
                    this._player.onJump();
                    break;
                case 3:
                    this._player.onSpecialJump();
                    break;
                case 4:
                    this._player.onSquat();
                    break;
                default:
                    this._player.onJump();
            }
        }

        private touchAbort(touchLength: number) {
            switch (touchLength) {
                case 3:
                    this._player.onAbortSquat();
                    break;
                case 1:
                case 2:
                    this._player.onAbortJump();
                    this._player.onAbortSquat();
                    break;
                default:
                    this._player.onAbortGrab();
                    this._player.onAbortJump();
                    this._player.onAbortSquat();
            }
        }

        destroyCommand(): void {
        }

        registerCommand(): void {
            if (window.orientation == 0) {
                this._screenModeForMobile = 'PORTRAIT';
                this._deviceDirection = 1;
            } else if (window.orientation == 90) {
                this._screenModeForMobile = 'LANSCAPE';
                this._deviceDirection = 1;
            } else if (window.orientation == -90) {
                this._screenModeForMobile = 'LANSCAPE';
                this._deviceDirection = -1;
            }
            document.addEventListener('touchstart', (e) => {
                this.touch(e.targetTouches.length);
            });
            document.addEventListener('touchend', (e) => {
                this.touchAbort(e.targetTouches.length);
            });
            document.addEventListener('touchcancel', (e) => {
                this.touchAbort(e.targetTouches.length);
            });

            window.addEventListener('deviceorientation', (e) => {
                if (!this._player.isSquat()) {
                    let motion = 0;
                    switch (this._screenModeForMobile) {
                        case 'PORTRAIT':
                            motion = Math.round(e.gamma);
                            break;
                        case 'LANSCAPE':
                            motion = Math.round(e.beta) * this._deviceDirection;
                            break;
                    }

                    if (motion > 5) {
                        this._player.onAbortLeft();
                        this._player.onRight();
                    } else if (motion < -5) {
                        this._player.onAbortRight();
                        this._player.onLeft();
                    } else {
                        this._player.onAbortRight();
                        this._player.onAbortLeft();
                    }

                    if (Math.abs(motion) >= 20 && this._canSpeedUpForMobile) {
                        if (this._player.getDirection() == Direction.Left && motion < 0) {
                            this._canSpeedUpForMobile = false;
                            this._player.onSpeedUp();
                        } else if (this._player.getDirection() == Direction.Right && motion > 0) {
                            this._canSpeedUpForMobile = false;
                            this._player.onSpeedUp();
                        }
                    } else if (Math.abs(motion) < 20 && !this._canSpeedUpForMobile) {
                        this._player.onAbortSpeedUp();
                        this._canSpeedUpForMobile = true;
                    }
                }
            });
            window.addEventListener('orientationchange', (e) => {
                if (window.matchMedia("(orientation: portrait)").matches) {
                    this._screenModeForMobile = 'PORTRAIT';
                    this._deviceDirection = 1;
                }
                if (window.matchMedia("(orientation: landscape)").matches) {
                    this._screenModeForMobile = 'LANSCAPE';
                    if (window.orientation == 90) {
                        this._deviceDirection = 1;
                    } else {
                        this._deviceDirection = -1;
                    }
                }
            }, false);
        }
    }
}