
/// <reference path="../character/interface.ts" />
/// <reference path="../character/abstract_character.ts" />
/// <reference path="../character/object/abstract_other_object.ts" />
/// <reference path="../character/enemy/abstract_enemy.ts" />
/// <reference path="../character/player/mario_world.ts" />
/// <reference path="../character/controller/keyboard_controller.ts" />
/// <reference path="../game_master.ts" />
/// <reference path="../util/promise.ts" />
/// <reference path="../util/promise.ts" />

((pixSize:number) => {
var mario = new Charjs.MarioWorld(document.body, pixSize, {x:0, y:0});
new Charjs.KeyboardController().init(mario).registerCommand();
mario.init().start();
})(2);
