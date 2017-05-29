namespace Charjs {

    export class KeyboardController implements IController {
        private _player: IPlayer;

        public static DefaultKeyAssign: IKeyAssign = {
            left: 37,
            right: 39,
            up: 38,
            down: 40,
            a: 65,
            b: 66,
            x: 88,
            y: 89,
            pause: 32
        };

        constructor(private _keyAssign: IKeyAssign = KeyboardController.DefaultKeyAssign) { }

        init(player: IPlayer, keyPattern?: any): IController {
            this._player = player;
            return this;
        }

        destroyCommand(): void {
        }

        registerCommand(): void {
            document.addEventListener('keydown', (e) => {
                if (e.keyCode == this._keyAssign.a) {
                    this._player.onJump();
                }
                if (e.keyCode == this._keyAssign.x || e.keyCode == this._keyAssign.y) {
                    this._player.onSpecialJump();
                }
                if (e.keyCode == this._keyAssign.b) {
                    this._player.onSpeedUp();
                    this._player.onGrab();
                }
                if (e.keyCode == this._keyAssign.up) {
                    this._player.onLookup();
                }
                if (e.keyCode == this._keyAssign.down) {
                    this._player.onSquat();
                }
                if (e.keyCode == this._keyAssign.left) {
                    this._player.onLeft();
                }
                if (e.keyCode == this._keyAssign.right) {
                    this._player.onRight();
                }
                if (e.keyCode == this._keyAssign.pause) {
                    this._player.onPause();
                }
            });
            document.addEventListener('keyup', (e) => {
                if (e.keyCode == this._keyAssign.a || e.keyCode == this._keyAssign.x || e.keyCode == this._keyAssign.y) {
                    this._player.onAbortJump();
                }
                if (e.keyCode == this._keyAssign.b) {
                    this._player.onAbortSpeedUp();
                    this._player.onAbortGrab();
                }
                if (e.keyCode == this._keyAssign.up) {
                    this._player.onAbortLookup();
                }
                if (e.keyCode == this._keyAssign.down) {
                    this._player.onAbortSquat();
                }
                if (e.keyCode == this._keyAssign.left) {
                    this._player.onAbortLeft();
                }
                if (e.keyCode == this._keyAssign.right) {
                    this._player.onAbortRight();
                }
            });
        }
    }
}