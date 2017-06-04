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

    export class RemoteControllerHost implements IController {

        private _peerHost: PeerConnector = null;
        private _player: IPlayer;
        private _hostId = null;
        private _isPausePressed = false;

        constructor() {
        }

        init(player: IPlayer, keyPattern?: any): IController {
            this._player = player;
            return this;
        }

        registerCommand(callback?: { (id: string) }): void {
            this._peerHost = PeerConnector.getPeer();
            this._peerHost.setReciveCallback(this.onRecive);
            this._peerHost.open().then((id) => {
                this._hostId = id;
                if (callback) {
                    callback(id);
                }
            });
        }

        destroyCommand(): void {
        }

        onRecive = (data) => {
            let command: IButtonState = JSON.parse(data);

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
                if (!this._isPausePressed) {
                    this._isPausePressed = true;
                    this._player.onPause();
                }
            } else {
                this._isPausePressed = false;
            }
        }
    }
}