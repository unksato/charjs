
namespace Charjs {
    export class GamepadController implements IController {

        private _gamepadTimer = null;
        private _player: IOperatePlayer = null;
        private _isPausePressed = false;

        public static DefaultKeyAssign: IKeyAssign = {
            left: 14,
            right: 15,
            up: 12,
            down: 13,
            a: 1,
            b: 0,
            x: 2,
            y: 3,
            pause: 9
        };

        constructor(private _padIndex = 0, private _keyAssign: IKeyAssign = GamepadController.DefaultKeyAssign, private scanInterval = 45) { }

        init(player: IOperatePlayer): IController {
            this._player = player;
            this._player.setController(this);
            return this;
        }

        static isGamepadConnected(index: number): boolean {
            let gamepads: Gamepad[] = navigator.getGamepads ? navigator.getGamepads() : ((<any>navigator).webkitGetGamepads ? (<any>navigator).webkitGetGamepads() : []);
            return gamepads[index] != null;
        }

        private scangamepads() {
            let gamepads: Gamepad[] = navigator.getGamepads ? navigator.getGamepads() : ((<any>navigator).webkitGetGamepads ? (<any>navigator).webkitGetGamepads() : []);
            if (gamepads[this._padIndex]) {
                this._gamepadTimer = setInterval(() => { this.updatePadStatus() }, this.scanInterval);
            }
        }

        private updatePadStatus() {
            let gamepads: Gamepad[] = navigator.getGamepads ? navigator.getGamepads() : ((<any>navigator).webkitGetGamepads ? (<any>navigator).webkitGetGamepads() : []);
            let gamepad = gamepads[this._padIndex];

            this._player.onAbortLookup();
            this._player.onAbortSquat();
            this._player.onAbortLeft();
            this._player.onAbortRight();

            // up
            if (gamepad.buttons[this._keyAssign.up].pressed) {
                this._player.onLookup();
            }
            // down
            if (gamepad.buttons[this._keyAssign.down].pressed) {
                this._player.onSquat();
            }
            // left
            if (gamepad.buttons[this._keyAssign.left].pressed) {
                this._player.onLeft();
            }
            // right
            if (gamepad.buttons[this._keyAssign.right].pressed) {
                this._player.onRight();
            }
            // A or X or Y
            if (gamepad.buttons[this._keyAssign.a].pressed || gamepad.buttons[this._keyAssign.x].pressed || gamepad.buttons[this._keyAssign.y].pressed) {
                if (gamepad.buttons[this._keyAssign.x].pressed || gamepad.buttons[this._keyAssign.y].pressed) {
                    this._player.onSpecialJump();
                } else {
                    this._player.onJump();
                }
            } else {
                this._player.onAbortJump();
            }
            // B
            if (gamepad.buttons[this._keyAssign.b].pressed) {
                this._player.onSpeedUp();
                this._player.onGrab();
            } else {
                this._player.onAbortSpeedUp();
                this._player.onAbortGrab();
            }

            if (gamepad.buttons[this._keyAssign.pause].pressed) {
                if (!this._isPausePressed) {
                    this._isPausePressed = true;
                    this._player.onPause();
                }
            } else {
                this._isPausePressed = false;
            }
        }

        destroyCommand(): void {
            if (this._gamepadTimer) clearInterval(this._gamepadTimer);
        }

        registerCommand(): void {
            let gamepads: Gamepad[] = navigator.getGamepads ? navigator.getGamepads() : ((<any>navigator).webkitGetGamepads ? (<any>navigator).webkitGetGamepads() : []);
            if (gamepads && gamepads[this._padIndex]) {
                this.scangamepads();
            } else {
                window.addEventListener("gamepadconnected", (e) => {
                    this.scangamepads();
                })
            }
        }
    }
}