namespace Charjs {

    export interface IButtonState {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
        a: boolean;
        b: boolean;
        x: boolean;
        y: boolean;
        pause: boolean;
    }

    export class PlayerProxy implements IOperatePlayer {
        protected _gameController: IController = null;
        private _buttonUpdated = false;
        private _isPausePressed = false;

        private _timer = null;

        private _butttonState: IButtonState = {
            up: false,
            down: false,
            left: false,
            right: false,
            a: false,
            b: false,
            x: false,
            y: false,
            pause: false
        };

        constructor(private _player: IPlayer, private _peerClinet: PeerConnector) { }

        setController(gameController: IController) {
            this._gameController = gameController;
            this._timer = setInterval(() => {
                if (this._buttonUpdated) {
                    this._peerClinet.send(this._player._name, this._butttonState);
                    this._buttonUpdated = false;
                    this._butttonState.pause = false;
                }
            }, 20);
        }

        onCommand = (command: IButtonState) => {
            this._player.onAbortLookup();
            this._player.onAbortSquat();
            this._player.onAbortLeft();
            this._player.onAbortRight();

            // up
            if (command.up) {
                this._player.onLookup();
            }
            // down
            if (command.down) {
                this._player.onSquat();
            }
            // left
            if (command.left) {
                this._player.onLeft();
            }
            // right
            if (command.right) {
                this._player.onRight();
            }
            // A or X or Y
            if (command.a || command.x || command.y) {
                if (command.x || command.y) {
                    this._player.onSpecialJump();
                } else {
                    this._player.onJump();
                }
            } else {
                this._player.onAbortJump();
            }
            // B
            if (command.b) {
                this._player.onSpeedUp();
                this._player.onGrab();
            } else {
                this._player.onAbortSpeedUp();
                this._player.onAbortGrab();
            }

            if (command.pause) {
                this._player.onPause();
            }
        }

        sendButtonState() {
            this._buttonUpdated = true;
        }

        onJump() {
            if (!this._butttonState.a) {
                this._butttonState.a = true;
                this.sendButtonState();
            }
            this._player.onJump();
        }
        onSpecialJump() {
            if (!this._butttonState.x) {
                this._butttonState.x = true;
                this.sendButtonState();
            }
            this._player.onSpecialJump();
        }
        onAbortJump() {
            if (this._butttonState.a || this._butttonState.x) {
                this._butttonState.a = false;
                this._butttonState.x = false;
                this.sendButtonState();
            }
            this._player.onAbortJump();
        }
        onSpeedUp() {
            if (!this._butttonState.b) {
                this._butttonState.b = true;
                this.sendButtonState();
            }
            this._player.onSpeedUp();
        }
        onAbortSpeedUp() {
            if (this._butttonState.b) {
                this._butttonState.b = false;
                this.sendButtonState();
            }
            this._player.onAbortSpeedUp();
        }
        onLookup() {
            if (!this._butttonState.up) {
                this._butttonState.up = true;
                this.sendButtonState();
            }
            this._player.onLookup();
        }
        onAbortLookup() {
            if (this._butttonState.up) {
                this._butttonState.up = false;
                this.sendButtonState();
            }
            this._player.onAbortLookup();
        }

        onSquat() {
            if (!this._butttonState.down) {
                this._butttonState.down = true;
                this.sendButtonState();
            }
            this._player.onSquat();
        }
        onAbortSquat() {
            if (this._butttonState.down) {
                this._butttonState.down = false;
                this.sendButtonState();
            }
            this._player.onAbortSquat();
        }

        onLeft() {
            if (!this._butttonState.left) {
                this._butttonState.left = true;
                this.sendButtonState();
            }
            this._player.onLeft();
        }
        onAbortLeft() {
            if (this._butttonState.left) {
                this._butttonState.left = false;
                this.sendButtonState();
            }
            this._player.onAbortLeft();
        }

        onRight() {
            if (!this._butttonState.right) {
                this._butttonState.right = true;
                this.sendButtonState();
            }
            this._player.onRight();
        }
        onAbortRight() {
            if (this._butttonState.right) {
                this._butttonState.right = false;
                this.sendButtonState();
            }
            this._player.onAbortRight();
        }

        onPause() {
            this._butttonState.pause = true;
            this.sendButtonState();
            this._player.onPause();
        }
        onGrab() {
            this._player.onGrab();
        }
        onAbortGrab() {
            this._player.onAbortGrab();
        }

    }

}