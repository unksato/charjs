namespace Charjs {

    export class RemoteControllerClient implements IOperatePlayer {
        protected _gameController: IController = null;
        private _buttonUpdated = false;
        private _peerClinet: PeerConnector = null;

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

        constructor(private _peerId: string) { }

        setController(gameController: IController) {
            this._gameController = gameController;
            this._peerClinet = PeerConnector.getPeer();
            this._peerClinet.connect(this._peerId).then(() => {
                this._timer = setInterval(() => {
                    if (this._buttonUpdated) {
                        this._peerClinet.send(JSON.stringify(this._butttonState));
                        this._buttonUpdated = false;
                    }
                }, 20);
            });

        }

        sendButtonState() {
            this._buttonUpdated = true;
        }

        onJump() {
            if (!this._butttonState.a) {
                this._butttonState.a = true;
                this.sendButtonState();
            }
        }
        onSpecialJump() {
            if (!this._butttonState.x) {
                this._butttonState.x = true;
                this.sendButtonState();
            }
        }
        onAbortJump() {
            if (this._butttonState.a || this._butttonState.x) {
                this._butttonState.a = false;
                this._butttonState.x = false;
                this.sendButtonState();
            }
        }
        onSpeedUp() {
            if (!this._butttonState.b) {
                this._butttonState.b = true;
                this.sendButtonState();
            }
        }
        onAbortSpeedUp() {
            if (this._butttonState.b) {
                this._butttonState.b = false;
                this.sendButtonState();
            }
        }
        onLookup() {
            if (!this._butttonState.up) {
                this._butttonState.up = true;
                this.sendButtonState();
            }
        }
        onAbortLookup() {
            if (this._butttonState.up) {
                this._butttonState.up = false;
                this.sendButtonState();
            }
        }

        onSquat() {
            if (!this._butttonState.down) {
                this._butttonState.down = true;
                this.sendButtonState();
            }
        }
        onAbortSquat() {
            if (this._butttonState.down) {
                this._butttonState.down = false;
                this.sendButtonState();
            }
        }

        onLeft() {
            if (!this._butttonState.left) {
                this._butttonState.left = true;
                this.sendButtonState();
            }
        }
        onAbortLeft() {
            if (this._butttonState.left) {
                this._butttonState.left = false;
                this.sendButtonState();
            }
        }

        onRight() {
            if (!this._butttonState.right) {
                this._butttonState.right = true;
                this.sendButtonState();
            }
        }
        onAbortRight() {
            if (this._butttonState.right) {
                this._butttonState.right = false;
                this.sendButtonState();
            }
        }

        onPause() { }
        onGrab() { }
        onAbortGrab() { }

    }

}