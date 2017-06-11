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
        private _isPausePressed = false;

        constructor() {
        }

        init(player: IPlayer): RemoteControllerHost {
            this._player = player;
            return this;
        }

        setPeer(peer: PeerConnector): RemoteControllerHost {
            this._peerHost = peer;
            return this;
        }

        registerCommand(): void {
            this._peerHost.setReciveCallback(`${this._player._name}:controll`, this.onRecive);
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