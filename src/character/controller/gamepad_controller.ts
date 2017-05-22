
namespace Charjs {
    export class GamepadController implements IController {

        private _gamepadTimer = null;
        private _player: IPlayer = null;

        constructor(private _padIndex = 0, private scanInterval = 45, private _gameMaster?: GameMaster) { }

        init(player: IPlayer): IController {
            this._player = player;
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

            this._player.onAbortSquat();
            this._player.onAbortLeft();
            this._player.onAbortRight();

            // down
            if (gamepad.buttons[13].pressed) {
                this._player.onSquat();
            }
            // left
            if (gamepad.buttons[14].pressed) {
                this._player.onLeft();
            }
            // right
            if (gamepad.buttons[15].pressed) {
                this._player.onRight();
            }
            // A or X or Y
            if (gamepad.buttons[1].pressed || gamepad.buttons[2].pressed || gamepad.buttons[3].pressed) {
                if (gamepad.buttons[2].pressed || gamepad.buttons[3].pressed) {
                    this._player.onSpecialJump();
                } else {
                    this._player.onJump();
                }
            } else {
                this._player.onAbortJump();
            }
            // B
            if (gamepad.buttons[0].pressed) {
                this._player.onSpeedUp();
                this._player.onGrab();
            } else {
                this._player.onAbortSpeedUp();
                this._player.onAbortGrab();
            }

            if (gamepad.buttons[9].pressed) {
                if (this._gameMaster) {
                    if (this._gameMaster.isStarting())
                        this._gameMaster.stop();
                    else
                        this._gameMaster.start();
                }
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