namespace Charjs {

    export class KeyboardController implements IController {
        private _player: IPlayer;

        constructor() { }

        init(player: IPlayer, keyPattern?: any): IController {
            this._player = player;
            return this;
        }

        destroyCommand(): void {
        }

        registerCommand(): void {
            document.addEventListener('keydown', (e) => {
                if (e.keyCode == 65) {
                    this._player.onJump();
                }
                if (e.keyCode == 88) {
                    this._player.onSpecialJump();
                }
                if (e.keyCode == 66) {
                    this._player.onSpeedUp();
                    this._player.onGrab();
                }
                if (e.keyCode == 40) {
                    this._player.onSquat();
                }
                if (e.keyCode == 37) {
                    this._player.onLeft();
                }
                if (e.keyCode == 39) {
                    this._player.onRight();
                }
                if (e.keyCode == 32) {
                    this._player.onPause();
                }
            });
            document.addEventListener('keyup', (e) => {
                if (e.keyCode == 65) {
                    this._player.onAbortJump();
                }
                if (e.keyCode == 88) {
                    this._player.onAbortJump();
                }
                if (e.keyCode == 66) {
                    this._player.onAbortSpeedUp();
                    this._player.onAbortGrab();
                }
                if (e.keyCode == 40) {
                    this._player.onAbortSquat();
                }
                if (e.keyCode == 37) {
                    this._player.onAbortLeft();
                }
                if (e.keyCode == 39) {
                    this._player.onAbortRight();
                }
            });
        }
    }
}